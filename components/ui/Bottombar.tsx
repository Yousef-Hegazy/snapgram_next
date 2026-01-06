import BottombarLink from "./BottombarLink";
import { bottombarLinks } from "@/lib/constants";

const Bottombar = () => {
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((l) => (
        <BottombarLink key={l.route} link={l} />
      ))}
    </section>
  );
};

export default Bottombar;
