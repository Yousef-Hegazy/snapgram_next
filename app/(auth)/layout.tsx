import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="flex h-screen w-full">
      <section className="flex flex-1 justify-center items-center flex-col py-10">{children}</section>
      <div className="relative hidden xl:block h-screen flex-1">
        <Image src="/images/side-img.svg" alt="Side Image" fill className="object-cover bg-no-repeat" />
      </div>
    </main>
  );
};

export default AuthLayout;
