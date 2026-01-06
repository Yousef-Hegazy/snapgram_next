import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex-center w-full">
      <Image src="/icons/loader.svg" alt="" width={24} height={24} />
    </div>
  );
};

export default Loader;
