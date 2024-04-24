import sys
import re

def convert_to_js(env_file_path):
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

    return js_code

if __name__ == "__main__":
    # Check if the correct number of arguments is provided
    if len(sys.argv) != 2:
        print("Usage: python script.py path_to_env_file")
        sys.exit(1)
    
    env_file_path = sys.argv[1]
    js_code = convert_to_js(env_file_path)
    print(js_code)
