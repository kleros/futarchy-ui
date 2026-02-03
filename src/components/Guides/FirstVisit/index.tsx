import MarketInfoSvg from "@/assets/miniguides/first-visit/market-info.svg";
import ProcessOrTimelineSvg from "@/assets/miniguides/first-visit/process-or-timeline.svg";
import ProfitOrLossSvg from "@/assets/miniguides/first-visit/profit-loss.svg";
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
    svg: <WelcomeSvg className="max-h-38 max-w-226" />,
  },
  {
    title: <MarketInfoTitle />,
    subtitle: <MarketInfoSubtitle />,
    svg: <MarketInfoSvg className="max-h-105 max-w-215" />,
  },
  {
    title: <ProcessAndTimelineTitle />,
    subtitle: <ProcessAndTimelineSubtitle />,
    svg: <ProcessOrTimelineSvg className="max-h-101 max-w-150" />,
  },
  {
    title: <ProfitOrLossTitle />,
    subtitle: <ProfitOrLossSubtitle />,
    svg: <ProfitOrLossSvg className="max-h-98 max-w-247" />,
  },
];

const FirstVisitGuide: React.FC<IGuide> = ({ isVisible, closeGuide }) => {
  return <GuideStructure content={content} {...{ isVisible, closeGuide }} />;
};

export default FirstVisitGuide;
