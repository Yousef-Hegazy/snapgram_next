import { cn } from "@/lib/utils";
import type { INavLink } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  link: INavLink;
};

const LeftSidebarLink = ({ link }: Props) => {
  const pathname = usePathname();

  const isActive = pathname === link.route;

  return (
    <li
      className={cn("leftsidebar-link group", {
        "bg-primary-500": isActive,
      })}
    >
      <Link href={link.route} className="flex gap-4 items-center p-4">
        <Image
          src={link.imgURL}
          alt={link.label}
          width={24}
          height={24}
          className={cn("group-hover:invert-white", {
            "invert-white": isActive,
          })}
        />
        <span>{link.label}</span>
      </Link>
    </li>
  );
};

export default LeftSidebarLink;
