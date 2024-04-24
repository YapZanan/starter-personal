"use client";
import { env } from "../env/server";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
	const { data: session, status } = useSession();
	const [imageFile, setImageFile] = useState<File | null>(null);

	function handleClick() {
		console.log("test");
	}

	return <>Test</>;
}
