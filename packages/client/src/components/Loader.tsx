type Loader = { size?: 'small' | 'smaller' | 'smallest' | 'normal' | 'large' }
export default function Loader({ size } : Loader) {
    let _size;
    if (size === 'smaller') {
      _size = 5;
    } else if (size === 'smallest') {
      _size = 4;
    } else if (size === 'small') {
      _size = 10;
    } else if (size === 'large') {
      _size = 20;
    } else {
      _size = 15;
    }
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className={`animate-spin rounded-full h-${_size} w-${_size} border-b-2 border-[#cf1112]`}></div>
    </div>
  );
}
