import Image from "next/image";
import Link from "next/link";
import { HouseIcon, CalendarCheck,Menu, Users,ListChecks, LibraryBig, ChartBarBig ,Info, Settings, LogOut, LayoutDashboard } from "lucide-react";

interface MenuProps {
  onClose?: () => void;
}
  
const menuItems1 = [
  {
    title: "MENU",
    items: [
      {
        icon: <LayoutDashboard />,
        label: "Home",
        href: "/funcionarios",
      },
      {
        icon: <CalendarCheck/>,
        label: "Pedir Dispensas",
        href: "/menu/pedir_dispensa",
      },
      {
        icon: <ListChecks />,
        label: "Minha Assiduidade",
        href: "/menu/assiduidade",
      },
      {
        icon: <LibraryBig />,
        label: "Minhas Formações",
        href: "/menu/formacoes",
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
        icon: <Settings />,
        label: "Definições",
        href: "/Definições",
      },
      {
        icon: <LogOut />,
        label: "Sair",
        href: "/Sair",
      },
    ],
  },
];

const Menu1 = ({ onClose }: MenuProps) => {
  return (
    <div className="h-full flex flex-col justify-between mt-4 text-sm">
       
      <div>
        {onClose && (
        <div className="flex justify-start gap-2 px-2 mb-4 md:hidden">
          <Menu
            onClick={onClose}
            className="text-white cursor-pointer"
          />
        </div>
      )}
        {menuItems1
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
        {menuItems1
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

export default Menu1;
