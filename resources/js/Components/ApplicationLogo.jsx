export default function ApplicationLogo(props, height = '12') {
    return (
        <span {...props} className={`group relative inline-block ${props.className || ''}`}>
            <img
                src="/storage/assets/face_no_smile.PNG"
                alt="Logo"
                className={`h-${height} w-auto transition-opacity duration-200 ease-in-out group-hover:opacity-0`}
            />
            <img
                src="/storage/assets/face_smile.PNG"
                alt="Logo Smiling"
                className={`pointer-events-none absolute left-0 top-0 h-${height} w-auto opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100`}
            />
        </span>
    );
}
