import { FooterWithLogo } from "./components/Footer";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";

const Homepage = () => {
  return (
    <div className=" space-y-20 ">
      <Section1 />
      <Section2 />
    </div>
  );
};

export default Homepage;
