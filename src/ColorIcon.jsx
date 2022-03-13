export default function ColorIcon({size, color}: {size: number, color: string}) {
    const ratio = 0.7067669173;
    return (
        <svg width={size*ratio} height={size} viewBox="0 0 376 532" fill="none">
            <path d="M237.84 28C227.199 10.641 208.16 0 188 0C167.84 0 148.801 10.641 138.16 28C105.68 81.762 0.400024 263.2 0.400024 344.4C0.400024 448 84.4 532 188 532C291.6 532 375.6 448 375.6 344.4C375.6 263.201 270.32 81.76 237.84 28V28ZM68.16 344.4C68.16 286.72 160 125.44 188 76.72V464.24C121.922 464.24 68.16 410.482 68.16 344.4V344.4Z" fill={color}/>
        </svg>
    );
}