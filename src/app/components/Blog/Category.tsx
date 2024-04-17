import { cs } from "@/src/utils"
import Link from "next/link"

type CategoryProp = {
    link: string,
    name: string,
    active: boolean
    
}
const Category: React.FC<CategoryProp> = ({link = "#", name, active, ...props}) => {
  
  return (
    <Link
    href={link}
    className={cs(
      "inline-block py-1.5  md:py-2 px-6  md:px-10   rounded-full border-2 border-solid border-dark dark:border-light hover:scale-105 transition-all ease duration-200 m-2",
      active ? "bg-dark text-light dark:bg-light dark:text-dark" : "bg-light text-dark dark:bg-dark dark:text-light"
    )}
  >
    #{name}
  </Link>
  )
}

export default Category