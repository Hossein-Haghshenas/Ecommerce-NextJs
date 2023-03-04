import Image from "next/image";
import loadingGif from "../../public/image/loading/loading-cart.gif";
import Container from "./container";

const Loading = () => {
  return (
    <Container flex justifyCenter alignCenter>
      <Image src={loadingGif} />
    </Container>
  );
};

export default Loading;
