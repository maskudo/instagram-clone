import Header from "../components/Header";
import Timeline from "../components/Timeline";
import Sidebar from "../components/Sidebar";
function Home() {
  return (
    <>
      <Header />
      <div className="d-flex row main-content">
        <Timeline />
        <Sidebar />
      </div>
    </>
  );
}

export default Home;
