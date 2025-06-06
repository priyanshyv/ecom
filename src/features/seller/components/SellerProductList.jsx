import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllProductsAsync,
  fetchAllProductsByFiltersAsync,
  selectAllProducts,
  selectTotalItems,
} from '../../product/ProductSlice';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon, StarIcon } from '@heroicons/react/20/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { ITEMS_PER_PAGE } from '../../../app/constants';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { motion } from 'framer-motion';

const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order: 'desc', current: false },
  { name: 'Price: Low to High', sort: 'price', order: 'asc', current: false },
  { name: 'Price: High to Low', sort: 'price', order: 'desc', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SellerProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const totalItems = useSelector(selectTotalItems);
  const user = useSelector(selectLoggedInUser);
  
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'seller' && user?.brand) {
      setFilter({...filter, brand: [user.brand]});
    }
  }, [user]);

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      if (newFilter[section.id]) {
        const index = newFilter[section.id].findIndex(
          (el) => el === option.value
        );
        if (index > -1) {
          newFilter[section.id].splice(index, 1);
        }
      }
    }
    setFilter(newFilter);
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
      const sellerFilter = { ...filter };
      if (user?.role === 'seller' && user?.brand) {
        sellerFilter.brand = [user.brand];
      }
      await dispatch(fetchAllProductsByFiltersAsync({ filter: sellerFilter, sort, pagination }));
      setIsLoading(false);
    };
    
    loadProducts();
  }, [dispatch, filter, sort, page, user]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/20 to-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-pink-floral.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative">
        <MobileFilter
          handleFilter={handleFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          user={user}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-baseline justify-between border-b border-pink-200/50 pb-6 pt-12"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-pink-900 font-serif">
                My Products
              </h1>
              <p className="mt-1 text-lg text-pink-600/80">{user?.brand}</p>
            </div>

            <div className="flex items-center space-x-3">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="group inline-flex justify-center items-center text-sm font-medium text-pink-700 hover:text-pink-900 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm shadow-pink-100/50 hover:shadow-pink-200/50 border border-pink-200/50 hover:border-pink-300 transition-all duration-200">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-4 w-4 flex-shrink-0 text-pink-500 group-hover:text-pink-700 transition-transform duration-200 group-data-[open]:rotate-180"
                    aria-hidden="true"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl bg-white/90 backdrop-blur-sm shadow-lg shadow-pink-100/50 ring-1 ring-pink-200/30 focus:outline-none overflow-hidden"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        {({ focus }) => (
                          <button
                            onClick={(e) => handleSort(e, option)}
                            className={classNames(
                              option.current
                                ? 'bg-pink-50 text-pink-900'
                                : 'text-pink-700',
                              focus ? 'bg-pink-50' : '',
                              'block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150'
                            )}
                          >
                            {option.name}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="p-2.5 text-pink-500 hover:text-pink-700 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm shadow-pink-100/50 hover:shadow-pink-200/50 border border-pink-200/50 hover:border-pink-300 transition-all duration-200"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="p-2.5 text-pink-500 hover:text-pink-700 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm shadow-pink-100/50 hover:shadow-pink-200/50 border border-pink-200/50 hover:border-pink-300 transition-all duration-200 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          <section aria-labelledby="products-heading" className="pb-24 pt-8">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <DesktopFilter handleFilter={handleFilter} user={user} />
              <div className="lg:col-span-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <Link 
                    to='/seller/product-form' 
                    className="inline-flex items-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold shadow-lg shadow-pink-200/50 hover:shadow-pink-300/50 hover:from-pink-700 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
                    Add New Product
                  </Link>
                </motion.div>
                
                {isLoading ? (
                  <ProductGridSkeleton />
                ) : (
                  <ProductGrid products={products} basePath="/seller" />
                )}
              </div>
            </div>
          </section>

          <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            totalItems={totalItems}
          />
        </main>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="group relative">
              <div className="animate-pulse bg-pink-50/50 rounded-xl shadow-sm h-60 w-full"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-pink-50/50 rounded w-3/4"></div>
                <div className="h-4 bg-pink-50/50 rounded w-1/2"></div>
                <div className="h-4 bg-pink-50/50 rounded w-1/3 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  user
}) {
  const filters = [
    {
      id: 'category',
      name: 'Category',
      options: [
        { value: 'beauty', label: 'Beauty', checked: false },
        { value: 'fragrances', label: 'Fragrances', checked: false },
        { value: 'furniture', label: 'Furniture', checked: false },
        { value: 'groceries', label: 'Groceries', checked: false }
      ],
    }
  ];

  return (
    <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-out"
      />

      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white/95 backdrop-blur-xl py-6 pb-12 shadow-xl transition duration-300 ease-in-out"
        >
          <div className="flex items-center justify-between px-6">
            <h2 className="text-xl font-medium text-pink-900">Filters</h2>
            <button
              type="button"
              className="-mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 p-2 text-pink-600 hover:bg-pink-50 transition-colors"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <form className="mt-6 border-t border-pink-100/50">
            {filters.map((section) => (
              <Disclosure
                as="div"
                key={section.id}
                className="border-t border-pink-100/30 px-6 py-5"
              >
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-pink-700 hover:text-pink-900 transition-colors">
                    <span className="font-medium text-pink-800">
                      {section.name}
                    </span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon className="h-5 w-5 group-data-[open]:hidden text-pink-500" aria-hidden="true" />
                      <MinusIcon className="h-5 w-5 [.group:not([data-open])_&]:hidden text-pink-500" aria-hidden="true" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center"
                      >
                        <input
                          id={`filter-mobile-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          onChange={(e) =>
                            handleFilter(e, section, option)
                          }
                          className="h-4 w-4 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                        />
                        <label
                          htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                          className="ml-3 min-w-0 flex-1 text-pink-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function DesktopFilter({ handleFilter, user }) {
  const filters = [
    {
      id: 'category',
      name: 'Category',
      options: [
        { value: 'beauty', label: 'Beauty', checked: false },
        { value: 'fragrances', label: 'Fragrances', checked: false },
        { value: 'furniture', label: 'Furniture', checked: false },
        { value: 'groceries', label: 'Groceries', checked: false }
      ],
    }
  ];

  return (
    <form className="hidden lg:block">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/50">
        {filters.map((section) => (
          <Disclosure
            as="div"
            key={section.id}
            className="border-b border-pink-100/30 py-5 last:border-0"
          >
            <h3 className="-my-3 flow-root">
              <DisclosureButton className="flex w-full items-center justify-between py-3 text-sm text-pink-700 hover:text-pink-900 transition-colors">
                <span className="font-medium text-pink-800">
                  {section.name}
                </span>
                <span className="ml-6 flex items-center">
                  <PlusIcon className="h-4 w-4 group-data-[open]:hidden text-pink-500" aria-hidden="true" />
                  <MinusIcon className="h-4 w-4 [.group:not([data-open])_&]:hidden text-pink-500" aria-hidden="true" />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-4">
              <div className="space-y-3">
                {section.options.map((option, optionIdx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`filter-${section.id}-${optionIdx}`}
                      name={`${section.id}[]`}
                      defaultValue={option.value}
                      type="checkbox"
                      defaultChecked={option.checked}
                      onChange={(e) => handleFilter(e, section, option)}
                      className="h-3.5 w-3.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                    />
                    <label
                      htmlFor={`filter-${section.id}-${optionIdx}`}
                      className="ml-3 text-sm text-pink-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </div>
    </form>
  );
}

function Pagination({ page, setPage, handlePage, handlePrevPage, handleNextPage, totalItems }) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between border-t border-pink-200/50 bg-white/80 backdrop-blur-sm px-6 py-6 sm:px-6 rounded-b-2xl shadow-sm"
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="relative inline-flex items-center rounded-xl border border-pink-300 bg-white/80 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-50/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="relative ml-3 inline-flex items-center rounded-xl border border-pink-300 bg-white/80 px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-50/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-pink-700">
            Showing{' '}
            <span className="font-medium text-pink-800">
              {(page - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-pink-800">
              {page * ITEMS_PER_PAGE > totalItems
                ? totalItems
                : page * ITEMS_PER_PAGE}
            </span>{' '}
            of <span className="font-medium text-pink-800">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-xl shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-pink-600 ring-1 ring-inset ring-pink-300/70 hover:bg-pink-50/50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePage(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  index + 1 === page
                    ? 'bg-pink-600 text-white shadow-inner shadow-pink-900/20'
                    : 'text-pink-700 ring-1 ring-inset ring-pink-300/70 hover:bg-pink-50/50'
                } focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-pink-600 transition-colors`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-pink-600 ring-1 ring-inset ring-pink-300/70 hover:bg-pink-50/50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </motion.div>
  );
}

function ProductGrid({ products = [], basePath = "/admin" }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-pink-100/50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {Array.isArray(products) && products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              <Link to={`/product-detail/${product.id}`}>
                <div className="group relative bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100/50 hover:border-pink-200/70 overflow-hidden">
                  {/* Ribbon for deleted products */}
                  {product.deleted && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 transform rotate-45 translate-x-8 -translate-y-1 z-10 w-32 text-center shadow-sm">
                      Deleted
                    </div>
                  )}
                  
                  {/* Product image with hover effect */}
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-pink-50/30 lg:aspect-none group-hover:opacity-90 lg:h-60 relative">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <span className="text-white font-medium text-sm bg-pink-600/90 px-3 py-1.5 rounded-full">
                        Quick View
                      </span>
                    </div>
                  </div>
                  
                  {/* Product info */}
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-pink-900 line-clamp-1">
                        {product.title}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-pink-500' : 'text-pink-200'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-pink-500">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-pink-900">
                        ${Math.round(product.price * (1 - product.discountPercentage / 100))}
                      </p>
                      {product.discountPercentage > 0 && (
                        <div className="flex items-center justify-end">
                          <p className="text-xs line-through font-medium text-pink-400 mr-1">
                            ${product.price}
                          </p>
                          <span className="text-xs font-medium bg-pink-100 text-pink-700 px-1 rounded">
                            -{Math.round(product.discountPercentage)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Edit button with hover effect */}
              <div className="mt-4 flex justify-center">
                <Link 
                  to={`${basePath}/product-form/edit/${product.id}`}
                  className="relative px-4 py-2 rounded-lg bg-pink-100 text-sm font-medium text-pink-700 shadow-sm hover:text-white hover:bg-pink-600 focus-visible:outline-offset-2 transition-all duration-300 group"
                >
                  <span className="relative z-10">Edit Product</span>
                  <span className="absolute inset-0 bg-pink-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}