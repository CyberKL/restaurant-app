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
import PaginatioinSection from "../common/PaginatioinSection";
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

  const itemsPerPage: number = 3;
  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;

  // Fetching menu items from DB
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/menu.json");
        const data = await response.json();
        setMenuItems(data);

        const uniqueCuisines = [
          ...new Set(data.map((item: FoodItem) => item.cuisine)),
        ];
        dispatch(setCuisines(uniqueCuisines as string[]));
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

  useEffect(() => {
    if (activeCategory === "all") {
      dispatch(setFilteredMenuItems(menuItems));
    } else if (activeCategory === "top" || activeCategory === "value") {
      dispatch(
        setFilteredMenuItems(
          menuItems.filter(
            (item) =>
              item.subcategory.toLowerCase() === activeCategory.toLowerCase()
          )
        )
      );
    } else {
      dispatch(
        setFilteredMenuItems(
          menuItems.filter(
            (item) =>
              item.category.toLowerCase() === activeCategory.toLowerCase()
          )
        )
      );
    }
  }, [activeCategory]);

  // Searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.toLowerCase();
    dispatch(
      setFilteredMenuItems(
        menuItems.filter(
          (item) =>
            item.title.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search)
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
    if (price.min && price.max) {
      const priceRange = price;
      filteredItems = filteredItems.filter(
        (item) => item.price >= priceRange.min && item.price < priceRange.max
      );
    }
    if (rating) {
      filteredItems = filteredItems.filter(
        (item) => Math.floor(item.rating) === rating
      );
    }
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
    console.log("options changed");
    if (options.isOptions) filterSort();
    else dispatch(setFilteredMenuItems(menuItems));
  }, [options]);

  return error ? (
    <div>Couldn't fetch menu items</div>
  ) : (
    <div className="space-y-8 py-10 snap-start">
      <h1 className="text-center text-3xl text-green-700">Menu</h1>

      {loading ? (
        <div className="grid place-items-center gap-5 divide-y-2 w-full sm:px-0 px-6">
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
        </div>
      ) : (
        <div className="grid place-items-center h-screen">
          {isSearching ? (
            <div className="flex w-full max-w-lg items-center space-x-2 px-2">
              <Input
                type="text"
                placeholder="Search"
                onChange={handleSearchChange}
                autoFocus
              />
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  setIsSearching(false);
                  dispatch(setFilteredMenuItems(menuItems));
                }}
              >
                <X />
              </Button>
            </div>
          ) : (
            <div className="grid place-items-center grid-cols-12 max-w-lg gap-2">
              <ScrollArea className="w-full max-w-lg col-span-9 whitespace-nowrap">
                {options.isOptions ? <OptionsSection /> : <CategorySection />}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setIsSearching(true)}
              >
                <Search />
              </Button>

              <FilterSortSection />
            </div>
          )}
          <div className="grid place-items-center gap-5 divide-y-2 w-full sm:px-0 px-6">
            {filteredMenuItems.length === 0
              ? menuItems
                  .slice(startIndex, endIndex)
                  .map((item, index) => (
                    <MenuItem
                      {...item}
                      quantity={
                        cart.find((i) => i.id === item.id)?.quantity || 0
                      }
                      key={index}
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
                    />
                  ))}
          </div>
          <PaginatioinSection
            totalItems={
              filteredMenuItems.length === 0
                ? menuItems.length
                : filteredMenuItems.length
            }
            itemsPerPage={itemsPerPage}
            pageRange={3}
          />
        </div>
      )}

      {cart.length > 0 ? (
        <div className="fixed bottom-0 flex justify-center w-full py-5 bg-white border-t border-gray-300">
          <div className="grid grid-cols-2 gap-32 px-5">
            <Link to={"/cart"}>
              <Button
                variant={"outline"}
                size={"lg"}
                className="text-green-600 w-full hover:scale-110 transition"
              >
                Cart
              </Button>
            </Link>
            <Link to={"/checkout"}>
              <Button
                size={"lg"}
                className="bg-green-600 w-full hover:scale-110 transition"
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CategorySection() {
  const options = useSelector((state: RootState) => state.foodMenu.options);
  const activeCategory = useSelector(
    (state: RootState) => state.foodMenu.activeCategory
  );

  const dispatch = useDispatch();

  const handleCategoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setActiveCategory(e.currentTarget.id));
  };

  useEffect(() => {
    dispatch(setActiveCategory("all"));
  }, [options]);

  return (
    <div className="flex justify-between w-full text-center space-x-4 p-4">
      <button
        id="all"
        className={`${
          activeCategory === "all" ? "border-b-4" : "text-gray-400"
        } border-green-600 flex-1 p-1 min-w-24`}
        onClick={handleCategoryClick}
      >
        All
      </button>
      <button
        id="top"
        className={`${
          activeCategory === "top" ? "border-b-4" : "text-gray-400"
        } border-green-600 flex-1 p-1 min-w-24`}
        onClick={handleCategoryClick}
      >
        Top dishes
      </button>
      <button
        id="value"
        className={`${
          activeCategory === "value" ? "border-b-4" : "text-gray-400"
        } border-green-600 flex-1 p-1 min-w-24`}
        onClick={handleCategoryClick}
      >
        Value meals
      </button>
      <button
        id="appetizers"
        className={`${
          activeCategory === "appetizers" ? "border-b-4" : "text-gray-400"
        } border-green-600 flex-1 p-1 min-w-24`}
        onClick={handleCategoryClick}
      >
        Appetizers
      </button>
      <button
        id="salads"
        className={`${
          activeCategory === "salads" ? "border-b-4" : "text-gray-400"
        } border-green-600 flex-1 p-1 min-w-24`}
        onClick={handleCategoryClick}
      >
        Salads
      </button>
      <button
        id="main"
        className={`${
          activeCategory === "main" ? "border-b-4" : "text-gray-400"
        } border-green-600 flex-1 p-1 min-w-24`}
        onClick={handleCategoryClick}
      >
        Main dishes
      </button>
      <button
        id="desserts"
        className={`${
          activeCategory === "desserts" ? "border-b-4" : "text-gray-400"
        } border-green-600 flex-1 p-1 min-w-24`}
        onClick={handleCategoryClick}
      >
        Desserts
      </button>
    </div>
  );
}

function FilterSortSection() {
  const priceRange = useSelector(
    (state: RootState) => state.foodMenu.priceRange
  );
  const sort = useSelector((state: RootState) => state.foodMenu.sort);
  const cuisines = useSelector((state: RootState) => state.foodMenu.cuisines);
  const price = useSelector((state: RootState) => state.foodMenu.price);
  const rating = useSelector((state: RootState) => state.foodMenu.rating);
  const selectedCuisines = useSelector(
    (state: RootState) => state.foodMenu.selectedCuisines
  );
  const options = useSelector((state: RootState) => state.foodMenu.options);

  const dispatch = useDispatch();

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
      <SheetTrigger>
        <ListFilter />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Options</SheetTitle>
          <SheetDescription>Sort and Filter menu items</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-8">
          {/* Sort section */}
          <div className="space-y-2">
            <h1 className="font-bold text-lg">Sort By</h1>
            <Select
              value={sort}
              onValueChange={(value) => dispatch(setSort(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphaA">Alphabetically, A-Z</SelectItem>
                <SelectItem value="alphaD">Alphabetically, Z-A</SelectItem>
                <SelectItem value="priceH">Price, High to Low</SelectItem>
                <SelectItem value="priceL">Price, Low to High</SelectItem>
                <SelectItem value="ratingH">Rating, High to Low</SelectItem>
                <SelectItem value="ratingL">Rating, Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter section */}
          <div className="space-y-2">
            <h1 className="text-lg font-bold">Filter</h1>
            <div className="space-y-4">
              {/* Cuisine filter */}
              <div className="space-y-2">
                <h2 className="font-semibold">Cuisine Type</h2>
                <div className="grid grid-cols-12 place-items-start gap-2">
                  {cuisines.map((cuisine, index) => (
                    <div
                      className="flex items-center space-x-2 col-span-6"
                      key={index}
                    >
                      <Checkbox
                        id={cuisine}
                        checked={selectedCuisines.includes(cuisine)}
                        onCheckedChange={(checked) => {
                          checked
                            ? dispatch(
                                setSelectedCuisines([
                                  ...selectedCuisines,
                                  cuisine,
                                ])
                              )
                            : dispatch(
                                setSelectedCuisines(
                                  selectedCuisines.filter(
                                    (item) => item !== cuisine
                                  )
                                )
                              );
                        }}
                      />
                      <label
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
                <h2 className="font-semibold">Price range</h2>
                <ToggleGroup
                  type="single"
                  value={JSON.stringify(price)}
                  onValueChange={(value) => dispatch(setPrice(value))}
                >
                  <div className="grid grid-cols-12 gap-2">
                    {priceRanges.map((range, index) => (
                      <ToggleGroupItem
                        value={JSON.stringify(range)}
                        className="col-span-3 text-nowrap"
                        variant={"outline"}
                        size={"sm"}
                        key={index}
                      >
                        {range.min} - {range.max}
                      </ToggleGroupItem>
                    ))}
                  </div>
                </ToggleGroup>
              </div>

              {/* Rating filter */}
              <div className="space-y-2">
                <h2 className="font-semibold">Rating</h2>
                <div className="">
                  <Rating
                    onClick={(value) => dispatch(setRating(value))}
                    initialValue={rating}
                    SVGclassName={"inline-block"}
                    fillColor="green"
                    size={30}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter className="space-x-5">
          <SheetClose asChild>
            <Button
              variant={"outline"}
              onClick={() => dispatch(resetFilterSort())}
            >
              Reset
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
            >
              Confirm
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
  const sorts: Sorts = {
    alphaA: "Alphabetically, A-Z",
    alphaD: "Alphabetically, Z-A",
    priceH: "Price, High to Low",
    priceL: "Price, Low to High",
    ratingH: "Rating, High to Low",
    ratingL: "Price, Low to High",
  };

  const dispatch = useDispatch();

  return (
    <div className="flex space-x-4 p-4 divide-x-2">
      {options.sort ? (
        <div className="flex justify-between gap-2 border border-gray-300 p-2 rounded-md">
          <p className="text-sm">{sorts[options.sort as keyof Sorts]}</p>
          <button
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
              Price: {options.price.min} - {options.price.max}
            </p>
            <button
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
            <p className="text-sm">Rating: {options.rating}</p>
            <button
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
