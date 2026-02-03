import ExternalLink from "@/components/ExternalLink";

import GuideSvg from "@/assets/miniguides/advanced/advanced-user-guide.svg";

import { advancedUserGuide } from "@/consts/markets";

import GuideStructure, { IGuide } from "../GuideStructure";

export const Title: React.FC = () => {
  return (
    <>
      Congrats on your
      <br /> first prediction! 🎉
    </>
  );
};

export const SubTitle: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-klerosUIComponentsSecondaryText text-sm">
        To do more predictions 👉 see first our
      </p>
      <ExternalLink url={advancedUserGuide} text="Advanced User Guide" />
    </div>
  );
};

const content = [
  {
    title: <Title />,
    subtitle: <SubTitle />,
    svg: <GuideSvg className="max-h-66.5 max-w-53" />,
  },
];

const AdvancedGuide: React.FC<IGuide> = ({ isVisible, closeGuide }) => {
  return <GuideStructure content={content} {...{ isVisible, closeGuide }} />;
};

export default AdvancedGuide;
