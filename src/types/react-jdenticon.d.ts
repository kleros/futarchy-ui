declare module "react-jdenticon" {
  import { ComponentType } from "react";

  interface IdenticonProps {
    value?: string;
    size?: number | string;
    [key: string]: unknown;
  }

  const Identicon: ComponentType<IdenticonProps>;
  export default Identicon;
}
