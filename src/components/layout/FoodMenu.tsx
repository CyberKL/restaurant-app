import MenuItem from "../common/MenuItem";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import FoodItem from "@/types/foodItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import MenuItemSkeleton from "../common/MenuItemSkeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ListFilter, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "../ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Rating } from "react-simple-star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationSection from "../common/PaginationSection";
import {
  resetFilterSort,
  setActiveCategory,
  setCuisines,
  setCurrentPage,
  setFilteredMenuItems,
  setOptions,
  setPrice,
  setPriceRange,
  setRating,
  setSelectedCuisines,
  setSort,
} from "@/features/foodMenu/foodMenuSlice";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export default function FoodMenu() {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const cart = useSelector((state: RootState) => state.cart);
  const currentPage = useSelector(
    (state: RootState) => state.foodMenu.currentPage
  );
  const filteredMenuItems = useSelector(
    (state: RootState) => state.foodMenu.filteredMenuItems
  );
  const activeCategory = useSelector(
    (state: RootState) => state.foodMenu.activeCategory
  );
  const options = useSelector((state: RootState) => state.foodMenu.options);
  const sort = useSelector((state: RootState) => state.foodMenu.sort);
  const selectedCuisines = useSelector(
    (state: RootState) => state.foodMenu.selectedCuisines
  );
  const price = useSelector((state: RootState) => state.foodMenu.price);
  const rating = useSelector((state: RootState) => state.foodMenu.rating);

  const dispatch = useDispatch();
  const [t, i18n] = useTranslation();

  const itemsPerPage: number = 3;
  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;

  // Fetching menu items from DB
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/menu.json");
        const data: FoodItem[] = await response.json();        
        setMenuItems(data);

        const prices = data.map((item: FoodItem) => item.price); // Extract prices from the dataset
        const minPrice = Math.min(...prices); // Find the minimum price
        const maxPrice = Math.max(...prices); // Find the maximum price
        dispatch(
          setPriceRange({
            min: minPrice,
            max: maxPrice,
          })
        );

        setLoading(false);
      } catch (error) {
        setError(true);
        console.error(error);
      }
    };

    fetchMenuItems();
  }, []);

  // Localize the menu
  useEffect(() => {
    const translatedItems = menuItems.map((item) => ({
      ...item, // Copy existing properties
      cuisine: t(item.cuisine), // Translate and overwrite the cuisine
    }));

    // Get the localized cuisines
    const uniqueCuisines = [
      ...new Set(menuItems.map((item: FoodItem) => t(item.cuisine))),
    ];
    dispatch(setCuisines(uniqueCuisines as string[]));

    dispatch(setFilteredMenuItems(translatedItems))
  }, [loading, i18n.language])

  useEffect(() => {
    console.log(activeCategory)
    if (activeCategory === "all") {
      dispatch(setFilteredMenuItems(menuItems));
    } else if (activeCategory === "top" || activeCategory === "value" || activeCategory === "offers") {
      dispatch(
        setFilteredMenuItems(
          menuItems.filter(
            (item) =>
              t(item.subcategory).toLowerCase() === activeCategory.toLowerCase()
          )
        )
      );
    } else {
      dispatch(
        setFilteredMenuItems(
          menuItems.filter(
            (item) =>
              t(item.category).toLowerCase() === activeCategory.toLowerCase()
          )
        )
      );
    }
  }, [activeCategory]);

  // Searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.toLowerCase();
    let items: FoodItem[];
    if (filteredMenuItems.length === 0 && !options)
    {
      items = menuItems;
    }
    else if (filteredMenuItems.length > 0)
    {
      items = filteredMenuItems;
    }
    else {
      items = []
    }
    dispatch(
      setFilteredMenuItems(
        items.filter(
          (item) =>
            t(item.title).toLowerCase().includes(search) ||
            t(item.description).toLowerCase().includes(search)
        )
      )
    );
    dispatch(setCurrentPage(1)); // No seperation of concern!
  };

  const filterSort = () => {
    let filteredItems = menuItems;

    if (selectedCuisines.length !== 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedCuisines.includes(item.cuisine)
      );
    }
    console.log(filteredItems)
    if (price.min && price.max) {
      const priceRange = price;
      filteredItems = filteredItems.filter(
        (item) => item.price >= priceRange.min && item.price <= priceRange.max
      );
    }
    console.log(filteredItems)
    if (rating) {
      filteredItems = filteredItems.filter(
        (item) => item.rating >= rating
      );
    }
    console.log(filteredItems)
    if (sort) {
      const sortByKey = (property: keyof FoodItem, descending = false) => {
        filteredItems = [...filteredItems].sort((a, b) => {
          let x = a[property];
          let y = b[property];
          if (!descending) return x < y ? -1 : x > y ? 1 : 0;
          else return x > y ? -1 : x < y ? 1 : 0;
        });
      };
      switch (sort) {
        case "alphaA":
          sortByKey("title");
          break;
        case "alphaD":
          sortByKey("title", true);
          break;
        case "priceH":
          sortByKey("price", true);
          break;
        case "priceL":
          sortByKey("price");
          break;
        case "ratingH":
          sortByKey("rating", true);
          break;
        case "ratingL":
          sortByKey("rating");
          break;
      }
    }
    dispatch(setFilteredMenuItems(filteredItems));
  };

  useEffect(() => {
    if (options.isOptions) filterSort();
    else dispatch(setFilteredMenuItems(menuItems));
  }, [options]);

  return error ? (
    <div role="alert" aria-live="assertive">
      {t('foodMenu.loadError')}
    </div>
  ) : (
    <div className="space-y-8 py-10 snap-start">
      <h1 className="text-center text-3xl text-green-700" tabIndex={-1}>
        {t('foodMenu.title')}
      </h1>
  
      {loading ? (
        <div className="grid place-items-center gap-5 divide-y-2 w-full sm:px-0 px-6">
          <MenuItemSkeleton aria-label="Loading menu item" />
          <MenuItemSkeleton aria-label="Loading menu item" />
          <MenuItemSkeleton aria-label="Loading menu item" />
        </div>
      ) : (
        <div className="grid place-items-center h-screen">
          {isSearching ? (
            <div className="flex w-full max-w-lg items-center gap-2 px-2">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <Input
                id="search"
                type="text"
                placeholder={t('foodMenu.search')}
                onChange={handleSearchChange}
                autoFocus
              />
              <Button
                variant={"ghost"}
                size={"icon"}
                aria-label="Close search"
                onClick={() => {
                  setIsSearching(false);
                  filterSort();
                }}
              >
                <X />
              </Button>
            </div>
          ) : (
            <div className="grid place-items-center justify-end grid-cols-12 max-w-lg gap-2">
              <ScrollArea
                className="w-full max-w-lg col-span-9 whitespace-nowrap"
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                aria-label="Menu options"
              >
                {options.isOptions ? <OptionsSection /> : <CategorySection />}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
  
              <Button
                variant={"ghost"}
                size={"icon"}
                aria-label="Open search"
                onClick={() => setIsSearching(true)}
              >
                <Search />
              </Button>
  
              <FilterSortSection />
            </div>
          )}
          <div className="grid place-items-center gap-5 divide-y-2 w-full sm:px-0 px-6">
            {filteredMenuItems.length === 0 && !options.isOptions
              ? menuItems
                  .slice(startIndex, endIndex)
                  .map((item, index) => (
                    <MenuItem
                      {...item}
                      quantity={
                        cart.find((i) => i.id === item.id)?.quantity || 0
                      }
                      key={index}
                      aria-labelledby={`menuItem-${index}`}
                    />
                  ))
              : filteredMenuItems
                  .slice(startIndex, endIndex)
                  .map((item, index) => (
                    <MenuItem
                      {...item}
                      quantity={
                        cart.find((i) => i.id === item.id)?.quantity || 0
                      }
                      key={index}
                      aria-labelledby={`menuItem-${index}`}
                    />
                  ))}
            {filteredMenuItems.length === 0 && options.isOptions && (
              <p role="alert" aria-live="polite">
                No items match the filter criteria.
              </p>
            )}
          </div>
          <PaginationSection
            totalItems={
              filteredMenuItems.length === 0 && !options.isOptions
                ? menuItems.length
                : filteredMenuItems.length
            }
            itemsPerPage={itemsPerPage}
            pageRange={3}
            aria-label="Pagination"
          />
        </div>
      )}
  
      {cart.length > 0 && (
        <div
          className="fixed bottom-0 flex justify-center w-full py-5 bg-white border-t border-gray-300"
          aria-label="Cart actions"
        >
          <div className="grid grid-cols-2 gap-32 px-5">
            <Link to={"/cart"}>
              <Button
                variant={"outline"}
                size={"lg"}
                className="text-green-600 w-full hover:scale-110 transition"
                aria-label="View cart"
              >
                {t('foodMenu.cart')}
              </Button>
            </Link>
            <Link to={"/checkout"}>
              <Button
                size={"lg"}
                className="bg-green-600 w-full hover:scale-110 transition"
                aria-label="Checkout"
              >
                {t('foodMenu.checkout')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
  
}

function CategorySection() {
  const options = useSelector((state: RootState) => state.foodMenu.options);
  const activeCategory = useSelector(
    (state: RootState) => state.foodMenu.activeCategory
  );

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setActiveCategory(e.currentTarget.id));
  };

  useEffect(() => {
    dispatch(setActiveCategory("all"));
  }, [options]);

  return (
    <nav role="navigation" aria-label={t('foodMenu.categories.section')}>
      <div className="flex justify-between w-full text-center gap-4 p-4">
        {["all", "top", "offers", "value", "appetizers", "salads", "main", "desserts"].map(
          (category) => (
            <button
              key={category}
              id={category}
              className={`${
                activeCategory === category ? "border-b-4" : "text-gray-400"
              } border-green-600 flex-1 p-1 min-w-24`}
              onClick={handleCategoryClick}
              aria-pressed={activeCategory === category}
              aria-label={t(`foodMenu.categories.${category}`)}
              tabIndex={0}
            >
              {t(`foodMenu.categories.${category}`)}
            </button>
          )
        )}
      </div>
    </nav>
  );
}

function FilterSortSection() {
  const priceRange = useSelector(
    (state: RootState) => state.foodMenu.priceRange
  );
  const sort = useSelector((state: RootState) => state.foodMenu.sort);
  const cuisines = useSelector((state: RootState) => state.foodMenu.cuisines);
  // useEffect(() => {
  //   console.log(cuisines)
  // }, [cuisines])
  const price = useSelector((state: RootState) => state.foodMenu.price);
  const rating = useSelector((state: RootState) => state.foodMenu.rating);
  const selectedCuisines = useSelector(
    (state: RootState) => state.foodMenu.selectedCuisines
  );
  const options = useSelector((state: RootState) => state.foodMenu.options);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const priceRanges = [];
  const rangeCount = 4; // Number of ranges you want to create
  const rangeStep = Math.ceil((priceRange?.max - priceRange.min) / rangeCount); // Size of each range

  for (let i = 0; i < rangeCount; i++) {
    priceRanges.push({
      min: priceRange?.min + i * rangeStep,
      max: priceRange?.min + (i + 1) * rangeStep,
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} aria-label="Filter options">
          <ListFilter />
        </Button>
      </SheetTrigger>
      <SheetContent aria-labelledby="filter-title" aria-describedby="filter-description">
        <SheetHeader>
          <SheetTitle id="filter-title">{t('foodMenu.filtering.title')}</SheetTitle>
          <SheetDescription id="filter-description">{t('foodMenu.filtering.description')}</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-8">
          {/* Sort section */}
          <div className="space-y-2">
            <h1 className="font-bold text-lg">{t('foodMenu.filtering.sort.title')}</h1>
            <Select
              value={sort}
              onValueChange={(value) => dispatch(setSort(value))}
              aria-label="Sort options"
            >
              <SelectTrigger aria-haspopup="listbox">
                <SelectValue placeholder={t('foodMenu.filtering.sort.placeholder')} />
              </SelectTrigger>
              <SelectContent role="listbox">
                <SelectItem value="alphaA">{t('foodMenu.filtering.sort.alphaA')}</SelectItem>
                <SelectItem value="alphaD">{t('foodMenu.filtering.sort.alphaD')}</SelectItem>
                <SelectItem value="priceH">{t('foodMenu.filtering.sort.priceH')}</SelectItem>
                <SelectItem value="priceL">{t('foodMenu.filtering.sort.priceL')}</SelectItem>
                <SelectItem value="ratingH">{t('foodMenu.filtering.sort.ratingH')}</SelectItem>
                <SelectItem value="ratingL">{t('foodMenu.filtering.sort.ratingL')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          {/* Filter section */}
          <div className="space-y-2">
            <h1 className="text-lg font-bold">{t('foodMenu.filtering.filter.title')}</h1>
            <div className="space-y-4">
              {/* Cuisine filter */}
              <div className="space-y-2">
                <h2 className="font-semibold">{t('foodMenu.filtering.filter.cuisine')}</h2>
                <div className="grid grid-cols-12 place-items-start gap-2">
                  {cuisines.map((cuisine, index) => (
                    <div
                      className="flex items-center gap-2 col-span-6"
                      key={index}
                    >
                      <Checkbox
                        id={cuisine}
                        checked={selectedCuisines.includes(cuisine)}
                        onCheckedChange={(checked) => {
                          checked
                            ? dispatch(setSelectedCuisines([...selectedCuisines, cuisine]))
                            : dispatch(setSelectedCuisines(selectedCuisines.filter(item => item !== cuisine)));
                        }}
                        aria-labelledby={`label-${cuisine}`}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            const currentChecked = selectedCuisines.includes(cuisine);
                            currentChecked
                              ? dispatch(setSelectedCuisines(selectedCuisines.filter((item) => item !== cuisine)))
                              : dispatch(setSelectedCuisines([...selectedCuisines, cuisine]));
                          }
                        }}
                      />
                      <label
                        id={`label-${cuisine}`}
                        htmlFor={cuisine}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Price filter */}
              <div className="space-y-2">
                <h2 className="font-semibold">{t('foodMenu.filtering.filter.price')}</h2>
                <ToggleGroup
                  type="single"
                  value={JSON.stringify(price)}
                  onValueChange={(value) => dispatch(setPrice(value))}
                  aria-label="Price range filter"
                >
                  <div className="grid grid-cols-12 gap-2">
                    {priceRanges.map((range, index) => (
                      <ToggleGroupItem
                        value={JSON.stringify(range)}
                        className="col-span-3 text-nowrap"
                        variant={"outline"}
                        size={"sm"}
                        key={index}
                        role="button"
                        aria-pressed={JSON.stringify(price) === JSON.stringify(range)}
                      >
                        {range.min} - {range.max}
                      </ToggleGroupItem>
                    ))}
                  </div>
                </ToggleGroup>
              </div>
  
              {/* Rating filter */}
              <div className="space-y-2">
                <h2 className="font-semibold">{t('foodMenu.filtering.filter.rating')}</h2>
                <div>
                  <Rating
                    onClick={(value) => dispatch(setRating(value))}
                    initialValue={rating}
                    SVGclassName={"inline-block"}
                    fillColor="green"
                    size={30}
                    rtl={i18n.language === 'ar'}
                    allowFraction
                    aria-label="Rating filter"
                    aria-live="polite"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter className="gap-5">
          <SheetClose asChild>
            <Button
              variant={"outline"}
              onClick={() => dispatch(resetFilterSort())}
              aria-label="Reset filters"
            >
              {t('foodMenu.reset')}
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              onClick={() =>
                dispatch(
                  setOptions({
                    ...options,
                    isOptions: true,
                    sort: sort,
                    cuisines: selectedCuisines,
                    price: price,
                    rating: rating,
                  })
                )
              }
              aria-label="Apply filters"
            >
              {t('foodMenu.confirm')}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
}

function OptionsSection() {
  const options = useSelector((state: RootState) => state.foodMenu.options);

  interface Sorts {
    alphaA: string;
    alphaD: string;
    priceH: string;
    priceL: string;
    ratingH: string;
    ratingL: string;
  }
  
  const dispatch = useDispatch();
  const [t] = useTranslation();
  
  const sorts: Sorts = {
    alphaA: t('foodMenu.filtering.sort.alphaA'),
    alphaD: t('foodMenu.filtering.sort.alphaD'),
    priceH: t('foodMenu.filtering.sort.priceH'),
    priceL: t('foodMenu.filtering.sort.priceL'),
    ratingH: t('foodMenu.filtering.sort.ratingH'),
    ratingL: t('foodMenu.filtering.sort.ratingL'),
  };

  return (
    <div className="flex space-x-4 p-4 divide-x-2">
      {options.sort ? (
        <div className="flex justify-between gap-2 border border-gray-300 p-2 rounded-md">
          <p className="text-sm">{sorts[options.sort as keyof Sorts]}</p>
          <button
            aria-label="Clear sort" // Accessible label
            onClick={() => {
              dispatch(
                setOptions({
                  ...options,
                  sort: "",
                })
              );
              dispatch(setSort(""));
            }}
          >
            <X size={15} />
          </button>
        </div>
      ) : null}
      {options.price.min && options.price.max ? (
        <div className="pl-4">
          <div className="flex justify-between gap-2 border border-gray-300 rounded-md p-2">
            <p className="text-sm">
              {t('foodMenu.options.price')}: {options.price.min} - {options.price.max}
            </p>
            <button
              aria-label={t('foodMenu.options.clearPrice')} // Accessible label
              onClick={() => {
                dispatch(
                  setOptions({
                    ...options,
                    price: { min: 0, max: 0 },
                  })
                );
                dispatch(setPrice(JSON.stringify({ min: 0, max: 0 })));
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : null}
      {options.rating ? (
        <div className="pl-4">
          <div className="flex justify-between gap-2 border border-gray-300 p-2 rounded-md">
            <p className="text-sm">
              {t('foodMenu.options.rating')}: {options.rating}
            </p>
            <button
              aria-label="Clear rating" // Accessible label
              onClick={() => {
                dispatch(
                  setOptions({
                    ...options,
                    rating: 0,
                  })
                );
                dispatch(setRating(0));
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex gap-2 pl-4">
        {options.cuisines.length !== 0
          ? options.cuisines.map((item, index) => (
              <div
                key={index}
                className="flex justify-between gap-2 border border-gray-300 p-2 rounded-md"
              >
                <p className="text-sm">{item}</p>
                <button
                  aria-label={`Clear cuisine: ${item}`} // Accessible label
                  onClick={() => {
                    const newCuisines = options.cuisines.filter(
                      (cuisine) => cuisine !== item
                    );
                    dispatch(
                      setOptions({
                        ...options,
                        cuisines: newCuisines,
                      })
                    );
                    dispatch(setSelectedCuisines(newCuisines));
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  );  
}
