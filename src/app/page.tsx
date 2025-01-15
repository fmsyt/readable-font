import Playground from "./components/Playground";
import { createInputPatterns } from "./lib/character";

export default function Home() {
	return (
		<div className="container mx-auto px-4">
			<Playground />

			<div className="mockup-code">
				<pre><code>{createInputPatterns("らっきょ")}</code></pre>
			</div>
		</div>
	);
}
