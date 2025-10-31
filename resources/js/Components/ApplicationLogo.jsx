export default function ApplicationLogo(props) {
    return (
        <span {...props} className={`group relative inline-block ${props.className || ''}`}>
            <img
                src="build/assets/media/face_no_smile.png"
                alt="Logo"
                className="h-12 w-auto transition-opacity duration-200 ease-in-out group-hover:opacity-0"
            />
            <img
                src="build/assets/media/face_smile.png"
                alt="Logo Smiling"
                className="pointer-events-none absolute left-0 top-0 h-12 w-auto opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
            />
        </span>
    );
}
