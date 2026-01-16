import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export default function MyIsland() {
  const count = useSignal(0);

  useEffect(() => {
    console.log("MyIsland effect");
    
window.onload = function () {
    google.accounts.id.initialize({
      client_id: '872731162262-gfne5ui715pitdarosboeirgasea1gqk.apps.googleusercontent.com',
      callback: () => {}
    });
    google.accounts.id.prompt();
  };
    

  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => (count.value += 1)}>+</button>
    </div>
  );
}
