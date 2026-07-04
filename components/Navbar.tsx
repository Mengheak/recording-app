'use client'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const user = {};

const Navbar = () => {
    const router = useRouter()
    return (
        <header className="navbar">
            <nav>
                <Link href={"/"}>
                    <Image alt={"Logo"} src={"/assets/icons/logo.svg"} width={32} height={32}/>
                    <h1 className={""}>SnapCast</h1>
                </Link>

                {
                    user && 
                    <figure>
                        <button onClick={() => router.push('/profile/1222331123') } className="rounded-full overflow-hidden">
                            <Image alt={"User Profile"} src={"/assets/images/dummy.jpg"} width={36} height={36} />
                        </button>
                        <button className={"cursor-pointer rotate-180"}>
                            <Image alt={"logout"} src={"/assets/icons/logout.svg"} width={24} height={24}/>
                            
                        </button>
                    </figure>
                }
            </nav>
        </header>
    )
}
export default  Navbar;