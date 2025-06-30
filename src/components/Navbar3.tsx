import Image from "next/image"


const Navbar = () => {
  return (
    <div className='flex h-20  items-center justify-between p-2 bg-transparent '>
    {/* SEARCH BAR */}
    <div className='md:flex items-center gap-2 px-2'>
      <Image src="/Onono.jpg" alt="" className=" mix-blend-lighten " width={340} height={240}/>
    </div>
    {/* ICONS AND USER */}
    <div className='flex items-center gap-6 justify-end w-full'>
      <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
        <Image src="/message.png" alt="" width={20} height={20}/>
      </div>
      <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
        <Image src="/announcement.png" alt="" width={20} height={20}/>
        <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>1</div>
      </div>
      <div className='flex flex-col'>
        <span className="text-xs leading-3 font-medium"></span>
        <span className="text-[10px] text-gray-500 text-right">Admin</span>
      </div>
    </div>
  </div>

  )
}

export default Navbar