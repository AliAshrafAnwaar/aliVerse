export default function ApplicationLogo(props, height = '12') {
    return (
        <span {...props} className={`group relative inline-block ${props.className || ''}`}>
            <img
                src="/build/assets/media/face_no_smile.png"
                alt="Logo"
                className={`h-${height} w-auto transition-opacity duration-200 ease-in-out group-hover:opacity-0`}
            />
            <img
                src="/build/assets/media/face_smile.png"
                alt="Logo Smiling"
                className={`pointer-events-none absolute left-0 top-0 h-${height} w-auto opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100`}
            />
        </span>
    );
}
