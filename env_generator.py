import time
import sys
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

def convert_to_ts(env_file_path, ts_file_name):
    try: 
        # Read the content of the environment file
        with open(env_file_path, 'r') as file:
            content = file.readlines()

        # Initialize dictionaries to store server, client, and runtime environment sections
        server_section = {}
        client_section = {}
        runtime_env_section = {}

        # Process each line in the file
        for line in content:
            line = line.strip()
            if line and not line.startswith("#"):
                key, value = line.split("=")
                key = key.strip()
                value = value.strip()
                # Check if the key starts with "NEXT_PUBLIC"
                if key.startswith("NEXT_PUBLIC"):
                    client_section[key] = value
                    runtime_env_section[key] = f"process.env.{key}"
                    # Check if the key starts with "NEXT_PUBLIC_SERVER_"
                    if key.startswith("NEXT_PUBLIC_SERVER_"):
                        key_client = key.replace("NEXT_PUBLIC_SERVER_", "NEXT_PUBLIC_")
                        key_server = key.replace("NEXT_PUBLIC_SERVER_", "NEXT_SERVER_")
                        client_section[key_client] = value
                        server_section[key_server] = value
                        runtime_env_section[key_client] = f"process.env.{key}"
                        runtime_env_section[key_server] = f"process.env.{key}"
                else:
                    server_section[key] = value
                    runtime_env_section[key] = f"process.env.{key}"
        
        # Generate JavaScript code
        js_code = (
            "import { createEnv } from \"@t3-oss/env-nextjs\";\n"
            "import { z } from \"zod\";\n\n"
            "export const env = createEnv({\n"
            "\tserver: {\n"
        )

        # Add server section to the JavaScript code
        js_code += "".join([f"\t\t{key}: z.string().min(1),\n" for key in server_section])

        js_code += (
            "\t},\n"
            "\tclient: {\n"
        )

        # Add client section to the JavaScript code
        js_code += "".join([f"\t\t{key}: z.string().min(1),\n" for key in client_section])

        js_code += (
            "\t},\n"
            "\truntimeEnv: {\n"
        )

        # Add runtime environment section to the JavaScript code
        js_code += "".join([f"\t\t{key}: {value},\n" for key, value in runtime_env_section.items()])

        js_code += "\t}\n});\n"

        with open(ts_file_name, "w") as ts_file:
            ts_file.write(js_code)

        print(f"Update completed. Check '{ts_file_name}' for the result.")

    except FileNotFoundError:
        print(f"Error: File '{ts_file_name}' not found.")

    # return js_code


class EnvFileHandler(FileSystemEventHandler):
    def __init__(self, env_filename=".env", env_dev_filename=".env.development", env_exam_filename=".env.example", ts_file_name=r"src\env\server.ts"):
        super().__init__()
        self.env_filename = env_filename
        self.env_dev_filename = env_dev_filename
        self.env_exam_filename = env_exam_filename
        self.last_update_time = time.time()  # Initialize last update time

    def on_modified(self, event):
        current_time = time.time()
        if (current_time - self.last_update_time) < 1:  # Check if less than 1 second since last update
            return  # Skip processing if less than 1 second
        self.last_update_time = current_time  # Update last update time
        
        if event.src_path.endswith(self.env_filename):
            print("Modified:", event.src_path)  # Print modified file path
            print(f"{self.env_filename} modified. Updating {self.env_dev_filename} and {self.env_exam_filename} ...")
            update_env_development(self.env_filename, self.env_dev_filename)
            convert_env_to_example(self.env_filename, self.env_exam_filename)
            js_content = convert_to_ts(self.env_exam_filename, ts_file_name)
            

def update_env_development(env_filename=".env", env_dev_filename=".env.development"):
    try:
        env_lines = []  # Store .env lines
        env_dev_lines = {}  # Store .env.development lines
        env_dev_variables = set()  # Store variables defined in .env.development

        # Read .env
        with open(env_filename, 'r') as env_file:
            for line in env_file:
                env_lines.append(line.strip())

        # Read .env.development and store its variables
        try:
            with open(env_dev_filename, 'r') as env_dev_file:
                for line in env_dev_file:
                    if '=' in line:
                        variable_name = line.split('=')[0].strip()
                        env_dev_variables.add(variable_name)
                        env_dev_lines[variable_name] = line.strip()
        except FileNotFoundError:
            pass

        # Update .env.development
        with open(env_dev_filename, 'w') as env_dev_file:
            for line in env_lines:
                if '=' in line:
                    variable_name = line.split('=')[0].strip()
                    if variable_name not in env_dev_variables:
                        env_dev_file.write(line + '\n')
                    elif variable_name in env_dev_lines:
                        env_dev_file.write(env_dev_lines[variable_name] + '\n')
                else:
                    env_dev_file.write(line + '\n')

        print(f"Update completed. Check '{env_dev_filename}' for the result.")
    except FileNotFoundError:
        print(f"Error: File '{env_filename}' not found.")

def convert_env_to_example(env_filename, example_filename):
    try:
        with open(env_filename, 'r') as env_file:
            with open(example_filename, 'w') as example_file:
                for line in env_file:
                    if '=' in line:
                        variable_name = line.split('=')[0].strip()
                        example_file.write(f"{variable_name}=\n")
                    else:
                        example_file.write(line)
        print(f"Conversion completed. Check '{example_filename}' for the result.")
    except FileNotFoundError:
        print(f"Error: File '{env_filename}' not found.")

if __name__ == "__main__":
    use_watchdog = False
    
    filename = __file__.strip().split('\\')[-1]
    if len(sys.argv) == 6:
        env_filename = sys.argv[1]
        env_dev_filename = sys.argv[2]
        env_exam_filename = sys.argv[3]
        ts_file_name = rf"{sys.argv[4]}"  # Convert to raw string
        use_watchdog = sys.argv[5].lower() == "true"
    elif len(sys.argv) != 1:
        if sys.argv[1] == "watchdog":
            env_filename = ".env"
            env_dev_filename = ".env.development"
            env_exam_filename = ".env.example"
            ts_file_name = r"src\env\server.ts"  # Convert to raw string


            print(f"Using auto-conversion with default value {env_filename} {env_dev_filename} {env_exam_filename} {ts_file_name}")

            use_watchdog = sys.argv[3].lower() == "true"
        else:
            print(f"Usage: python {filename} [<env_filename> <env_dev_filename> <env_exam_filename> <ts_file_name> <use_watchdog>]")
            sys.exit(1)
    else:
        env_filename = ".env"
        env_dev_filename = ".env.development"
        env_exam_filename = ".env.example"
        ts_file_name = r"src\env\server.ts"

    if use_watchdog:
        event_handler = EnvFileHandler(env_filename, env_dev_filename, env_exam_filename, ts_file_name)
        observer = Observer()
        observer.schedule(event_handler, path=".", recursive=False)
        observer.start()

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
            observer.join()
    else:
        # Do not use watchdog
        print(f"If you want to use auto-conversion: python {filename} watchdog = true")
        update_env_development(env_filename, env_dev_filename)
        convert_env_to_example(env_filename, env_exam_filename)
        convert_to_ts(env_exam_filename, ts_file_name)
