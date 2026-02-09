import ProcessAndTimelineSvg from "@/assets/miniguides/first-visit/process-and-timeline.svg";
import ProfitOrLossSvg from "@/assets/miniguides/first-visit/profit-loss.svg";
import SliderSvg from "@/assets/miniguides/first-visit/slider.svg";
import WelcomeSvg from "@/assets/miniguides/first-visit/welcome.svg";

import GuideStructure, { IGuide } from "../GuideStructure";

import {
  Title as MarketInfoTitle,
  SubTitle as MarketInfoSubtitle,
} from "./MarketInfo";
import {
  Title as ProcessAndTimelineTitle,
  SubTitle as ProcessAndTimelineSubtitle,
} from "./ProcessAndTimeline";
import {
  Title as ProfitOrLossTitle,
  SubTitle as ProfitOrLossSubtitle,
} from "./ProfitOrLoss";
import { Title as WelcomeTitle, SubTitle as WelcomeSubtitle } from "./Welcome";

const content = [
  {
    title: <WelcomeTitle />,
    subtitle: <WelcomeSubtitle />,
    svg: <WelcomeSvg className="max-h-110 max-w-215" />,
  },
  {
    title: <ProcessAndTimelineTitle />,
    subtitle: <ProcessAndTimelineSubtitle />,
    svg: <ProcessAndTimelineSvg className="max-h-110 max-w-215" />,
  },
  {
    title: <MarketInfoTitle />,
    subtitle: <MarketInfoSubtitle />,
    svg: <SliderSvg className="max-h-110 max-w-149.75" />,
  },
  {
    title: <ProfitOrLossTitle />,
    subtitle: <ProfitOrLossSubtitle />,
    svg: <ProfitOrLossSvg className="max-h-110 max-w-247.25" />,
  },
];

const FirstVisitGuide: React.FC<IGuide> = ({ isVisible, closeGuide }) => {
  return <GuideStructure content={content} {...{ isVisible, closeGuide }} />;
};

export default FirstVisitGuide;
