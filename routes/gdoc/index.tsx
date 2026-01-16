import { Head } from "fresh/runtime";
import { define } from "../../utils.ts";
import MyIsland from "../../islands/MyIsland.tsx";

export default define.page(function Home(ctx) {
  return (
    <>
      <Head>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </Head>

      <div id="results"></div>
      <MyIsland />
    </>
  );
});
