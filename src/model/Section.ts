import Restaurant from "./Restaurant";

export default interface Section {
    title: "Popular Restaurants" | "New Restaurants" | "Nearby Restaurants";
    restaurants: Array<Restaurant>;
}