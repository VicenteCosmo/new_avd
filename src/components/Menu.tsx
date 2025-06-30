'use client';
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard,HouseIcon,Menu as MenuIcon, CalendarCheck, Users,ListChecks, LibraryBig, ChartBarBig ,Info, Settings, LogOut} from "lucide-react";
interface MenuProps {
  onClose?: () => void;
}

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <LayoutDashboard />,
        label: "Home",
        href: "/admin",
      },
      {
        icon: <Users />,
        label: "Funcionário",
        href: "/list/funciona",
      },
      {
        icon: <CalendarCheck />,
        label: "Dispensas",
        href: "/list/dispensas",
      },
      {
        icon: <ListChecks/>,
        label: "Assiduidade",
        href: "/list/assiduidade",
      },
      {
        icon: <LibraryBig />,
        label: "Formações",
        href: "/list/get_courses",
      },
      {
        icon: <ChartBarBig />,
        label: "Perfomance",
        href: "/list/Perfomance",
      },
    ],
  },
  {
    title: "OUTROS",
    items: [
      {
        icon: <Info />,
        label: "Suporte",
        href: "/Suporte",
      },
      {
        icon: <Settings/>,
        label: "Definições",
        href: "/Definições",
      },
      {
        icon: <LogOut/>,
        label: "Sair",
        href: "/Sair",
      },
    ],
  },
];

const Menu = ({ onClose }: MenuProps) => {
  return (
    <div className="h-full flex flex-col justify-between mt-4 text-sm">
       
      <div>
        {onClose && (
        <div className="flex justify-start gap-2 px-2 mb-4 md:hidden">
          <MenuIcon
            onClick={onClose}
            className="text-white cursor-pointer"
          />
          <h1 className="text-white text-lg font-bold">Recursos Humanos</h1>

        </div>
      )}
      
        {menuItems
          .filter((section) => section.title === "MENU")
          .map((section) => (
            <div className="flex flex-col gap-2 py-4" key={section.title}>
              {section.items.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center gap-4 text-white py-2 px-2 rounded-md hover:bg-lamaSkyLight transition-colors duration-200 hover:text-blue-400"
                >
                  {typeof item.icon === "string" ? (
                    <Image src={item.icon} alt="" width={25} height={25} />
                  ) : (
                    item.icon
                  )}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
      </div>

      <div>
        {menuItems
          .filter((section) => section.title === "OUTROS")
          .map((section) => (
            <div className="flex flex-col gap-2 py-4" key={section.title}>
              {section.items.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center gap-4 text-white py-2 px-2 rounded-md hover:bg-lamaSkyLight transition-colors duration-200 hover:text-blue-400"
                >
                  {typeof item.icon === "string" ? (
                    <Image src={item.icon} alt="" width={25} height={25} />
                  ) : (
                    item.icon
                  )}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Menu;
