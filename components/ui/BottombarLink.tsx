"use client";

import type { INavLink } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

type Props = {
  link: INavLink;
};

const BottombarLink = ({ link }: Props) => {
  const pathname = usePathname();

  const isActive = pathname === link.route;

  return (
    <Link
      href={link.route}
      className={cn("rounded-[10px] group flex-center flex-col gap-2 p-4 transition", {
        "bg-primary-500": isActive,
      })}
    >
      <Image
        src={link.imgURL}
        alt={link.label}
        width={18}
        height={18}
        className={cn({
          "invert-white": isActive,
        })}
      />
      <p className="small-medium text-light-2">{link.label}</p>
    </Link>
  );
};

export default BottombarLink;
