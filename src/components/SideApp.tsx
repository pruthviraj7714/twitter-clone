

export default function SideApp({
    isActive,
  onClick,
  name,
  Icon,
  ActiveIcon
}: {
    isActive : boolean;
  onClick: () => void;
  name: string;
  Icon: any;
  ActiveIcon : any;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 my-4 text-xl px-3 py-3 cursor-pointer hover:bg-white/10 hover:rounded-full ${isActive ? "font-bold" : "font-semibold" }`}
    >
        {isActive ? (
            <ActiveIcon className="text-white font-bold" size={25} />
        ) : (
            <Icon className="text-white font-bold" size={25} />
        )}
      <span className="hidden lg:block">{name}</span>
    </div>
  );
}
