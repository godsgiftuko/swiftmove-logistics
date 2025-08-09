type ButtonLoader = { color?: string; }
export default function ButtonLoader({ color }: ButtonLoader) {
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-[${color}]`}></div>
    </div>
  );
}
