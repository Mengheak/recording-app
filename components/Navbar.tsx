'use client'
import Link from "next/link";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth.client";


const Navbar = () => {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const user = session?.user
    return (
        <header className="navbar">
            <nav>
                <Link href={"/"}>
                    <Image alt={"Logo"} src={"/assets/icons/logo.svg"} width={32} height={32} />
                    <h1 className={""}>SnapCast</h1>
                </Link>

                {
                    user &&
                    <figure>
                        <button onClick={() => router.push(`/profile/${user.id}`)} className="rounded-full overflow-hidden">
                            <Image alt={"User Profile"} src={user.image || ''} width={36} height={36} />
                        </button>
                        <button
                            onClick={async () => {
                                return await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            redirect("/sign-in");
                                        },
                                    },
                                });
                            }}
                            className="cursor-pointer"
                        >
                            <Image
                                src="/assets/icons/logout.svg"
                                alt="logout"
                                width={24}
                                height={24}
                                className="rotate-180"
                            />
                        </button>
                    </figure>
                }
            </nav>
        </header>
    )
}
export default Navbar;