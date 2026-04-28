import Link from "next/link"
import Image from "next/image"
import profileImg from "@/public/image/profile-img.png"

const Logo = ({ user }: any) => {
  const isSignedIn = Boolean(user?.userId)

  return ( 
    <Link href={isSignedIn ? "/userprofile" : "/signin"} className="flex items-center text-dark dark:text-light">
        <div className=" w-12 md:w-16 rounded-full overflow-hidden border border-solid border-dark dark:border-gray  mr-2 md:mr-4">
        {isSignedIn ? (
          <Image src={user.profilePicture} alt={user.username || "Profile"} width={20} height={20} className="w-full h-auto rounded-full" quality={35} />
        ) : (
          <Image src={profileImg} alt="naijup" className="w-full h-auto rounded-full" quality={35} />
        )}
        </div>
        <span className="font-bold dark:font-semibold text-lg md:text-xl">{user?.username || "NaijUp"}</span>
    </Link>
  )
}

export default Logo
