import Link from "next/link";
import { useRouter } from "next/navigation";

function LinkTransition(props) {
    const router = useRouter();
    const handleClick = (e) => {
        // @ts-ignore
        if (!document.startViewTransition) {
            // browser does not support view transition. Continue the default behavior.
            return;
        } else {
            // browser supports view transition. Animate the transtion.
            e.preventDefault();
            // @ts-ignore
            document.startViewTransition(() => {
                router.push(props.href);
            });
        }
    };

    return (
        <Link onClick={handleClick} {...props}>
            {props.children}
        </Link>
    );
}
export default LinkTransition;