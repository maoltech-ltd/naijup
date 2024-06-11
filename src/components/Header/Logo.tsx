import Link from "next/link"
import Image from "next/image"
import profileImg from "@/public/image/profile-img.png"

const Logo = ({user} : any) => {
  return ( 
    <Link href="/signin" className="flex items-center text-dark dark:text-light">
        <div className=" w-12 md:w-16 rounded-full overflow-hidden border border-solid border-dark dark:border-gray  mr-2 md:mr-4">
          if(!user){
           <Image src={profileImg} alt="naijup" className="w-full h-auto rounded-full" /> 
          }else{
            <Image src={user.img} alt={user.username} className="w-full h-auto rounded-full" />
          }
        </div>
        <span className="font-bold dark:font-semibold text-lg md:text-xl">NaijUp</span>
    </Link>
  )
}

export default Logo