import User from "@/types/user"

export const createUser = async (data: User): Promise<Response | null> => {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        return response
    } catch (error) {
        console.error("Error creating user", error);
        return null
    }
}