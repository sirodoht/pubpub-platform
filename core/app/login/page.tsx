import Head from "components/Head";
import LoginForm from "./LoginForm";

export default async function Page() {
	return (
		<div className="max-w-lg m-auto">
			<Head title="Login · PubPub" triggers={[]} />
			<LoginForm />
		</div>
	);
}
