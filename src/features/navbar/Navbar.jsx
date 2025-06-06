import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectItems } from '../cart/CartSlice'
import { logout, selectLoggedInUser } from '../auth/AuthSlice'
import { useState } from 'react'

const navigation = [
  { name: 'HOME', link: '/', current: true, user: true },
  { name: 'SHOP BY SPECIALITY', link: '#', current: false, user: true },
  { name: 'CRAFT STORIES', link: '#', current: false, user: true },
  { name: 'ALL ORDERS', link: '/admin/orders', current: false, admin: true },
  { name: 'ADMIN', link: '/admin', current: false, admin: true },
  { name: 'SELLER DASHBOARD', link: '/seller', current: false, seller: true },
  { name: 'MY ORDERS', link: '/seller/orders', current: false, seller: true },
];

const userNavigation = [
  { name: 'My Profile', link: '/profile', action: null },
  { name: 'My Orders', link: '/orders', action: null },
  { name: 'Sign out', link: '/login', action: 'logout' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = ({children}) => {
  const items = useSelector(selectItems);
  const user = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
  };

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (item.user) return true;
    if (item.admin && user?.role === 'admin') return true;
    if (item.seller && user?.role === 'seller') return true;
    return false;
  });

  return (
    <div className="min-h-full relative">
      <Disclosure as="nav" className="bg-pink-100 border-b border-gray-200">
        <div className="mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              {/* Logo and Site Name - Clickable Link to Home */}
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-pink-700 font-[Metamorphous]">INTERN PROJECT</span>
              </Link>

              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-10">
                  {filteredNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.link}
                      className={classNames(
                        item.current ? 'text-gray-900 border-b-2 border-gray-500' : 'text-gray-700 hover:text-gray-900',
                        'px-1 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search For Any Items"
                    className="w-72 px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-50" 
                  />
                </div>

                { (
                  <Link to="/cart">
                    <button
                      type="button"
                      className="relative text-gray-700 hover:text-gray-900"
                    >
                      <ShoppingCartIcon aria-hidden="true" className="size-6" />
                      {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-indigo-500 px-1.5 py-0.5 text-xs font-medium text-white">
                          {items.length}
                        </span>
                      )}
                    </button>
                  </Link>
                )}

                <Menu as="div" className="relative">
                  {({ open }) => {
                    if (open !== isMenuOpen) {
                      setIsMenuOpen(open);
                    }
                    return (
                      <>
                        <div>
                          <MenuButton className="relative flex items-center text-sm focus:outline-none">
                            <span className="sr-only">Open user menu</span>
                            <div className="size-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-300 transition-colors">
                              {user?.name?.charAt(0) || 'U'}
                            </div>
                          </MenuButton>
                        </div>
                        <MenuItems
                          transition
                          className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                        >
                          {userNavigation.map((item) => (
                            <MenuItem key={item.name}>
                              <Link
                                to={item.link}
                                onClick={item.action === 'logout' ? handleLogout : undefined}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {item.name}
                              </Link>
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </>
                    )
                  }}
                </Menu>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {filteredNavigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.link}
                className={classNames(
                  item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  'block px-3 py-2 rounded-md text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name || 'User'}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email || ''}</div>
              </div>
              {user?.role !== 'seller' && (
                <Link to="/cart" className="ml-auto">
                  <button
                    type="button"
                    className="relative text-gray-700 hover:text-gray-900"
                  >
                    <ShoppingCartIcon aria-hidden="true" className="size-6" />
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-indigo-500 px-1.5 py-0.5 text-xs font-medium text-white">
                        {items.length}
                      </span>
                    )}
                  </button>
                </Link>
              )}
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.link}
                  onClick={item.action === 'logout' ? handleLogout : undefined}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <main className="relative z-0">
        <div className="mx-auto px-6 sm:px-8 lg:px-10 py-6">{children}</div>
      </main>
    </div>
  )
}

export default Navbar