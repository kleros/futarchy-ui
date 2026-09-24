import BottomHeader from "./components/BottomHeader";
import ExperimentsGrid from "./components/ExperimentsGrid";
import Header from "./components/Header";
import HomepageOverlay from "./components/HomepageOverlay";

export default function Home() {
  return (
    <div className="relative w-full px-4 pt-6 pb-12 md:px-8 lg:px-32">
      <HomepageOverlay />
      <div className="mx-auto max-w-294">
        <Header />

        <ExperimentsGrid />

        <BottomHeader />
      </div>
    </div>
  );
}
