# Wolt Summer 2021 Internships (Backend)

**Preliminary Assignment for Engineering Positions**

This project implements the backend API for the **Discovery** page.

## Setup server instruction

The server runs in a `node (version>=12)` and `npm (version>=6)` environment.

1. Set up the dev dependencies by running the command:

```bash
npm install
```

2. Transcompile the JavaScript files with the command:

```bash
npm run build
```
This creates a `./build` folder with the transcompiled files from the `./src` folder.

3. Start node server with the command:

```bash
npm run start
```

## Note
The server runs on either port `process.env.PORT` or `3000`.
If the `restaurant.json` file is changed for testing purpose, the build command `npm run build` should be run again.

## Example

Sample Request: `http://localhost:3000/discovery?lon=24.935637&lat=60.171987`

Sample Response:

```json
{
	"payload": {
		"sections": [
			{
				"title": "Popular Restaurants",
				"restaurants": [
					{
						"blurhash": "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
						"launch_date": "2020-04-20",
						"location": [24.938082, 60.17626],
						"name": "Sea Chain",
						"online": true,
						"popularity": 0.956990414084132
					},
					{
						"blurhash": "UKB;Mk]|I^oJ1SJD$ebHESNMj[a}-4xBNeWX",
						"launch_date": "2020-10-25",
						"location": [24.949733, 60.166172],
						"name": "Bacon Basket",
						"online": true,
						"popularity": 0.9482709720911751
					},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...}
				]
			},
			{
				"title": "New Restaurants",
				"restaurants": [
					{
						"blurhash": "UGGb5p^|4@xEESt6xWWD1vS2xGkBQ;NHtixY",
						"launch_date": "2020-12-24",
						"location": [24.933944, 60.16461],
						"name": "Papas Octopus Factory",
						"online": true,
						"popularity": 0.3595856939421856
					},
					{
						"blurhash": "UFT8lemKgHpAq2cPesi%b.b.f~e?rLikf7f}",
						"launch_date": "2020-12-20",
						"location": [24.949907, 60.161059],
						"name": "Italian Garden",
						"online": true,
						"popularity": 0.0847131674543133
					},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...}
				]
			},
			{
				"title": "Nearby Restaurants",
				"restaurants": [
					{
						"blurhash": "UI97ru%EIvocNMa#t2oc0YIvxnR.-hocIvWF",
						"launch_date": "2020-01-20",
						"location": [24.938353, 60.172132],
						"name": "Chili Pepper",
						"online": true,
						"popularity": 0.8934866288893477
					},
					{
						"blurhash": "UGB|33~3I;Ic-{%DjcRo0|Ef$%xWIMM-kQxn",
						"launch_date": "2020-11-29",
						"location": [24.93623, 60.169935],
						"name": "Fake Onion",
						"online": true,
						"popularity": 0.23036375831315775
					},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...},
					{...}
				]
			}
		]
	}
}
```

## Overview

In 2017 we added a new view to the Wolt App, known as _Discovery_. The view mixes curated and automatically generated content, like banners, articles, videos and lists (e.g. _“Popular restaurants”, “New restaurants”_). Discovery is customized for each user based on their location, personal preferences and order history.

In this assignment you get to follow in the footsteps of Wolt developers and create a Discovery page, although a much simplified version (we don’t want you to spend hundreds of hours on this task 😀).

In the backend version you will generate _new / popular / nearby_ restaurant lists from the given data by taking the location of a customer into account. The frontend task is about rendering such content as horizontal carousels. You will also get to use one of our popular open source libraries, [Blurhash](https://blurha.sh/) in the frontend version.

It should take about 4-8 hours to complete this assignment. However, the best way to make your assignment really stand out is to **finish it with care** - the last 10% is often the most important part of any software project.

## Restaurant-object

Both frontend and backend tasks use restaurant objects which represent **fictive** restaurants in Helsinki. Each object has a set of fields providing more information about the restaurant, like _name_ and _location_.

Example:

```
{
   "blurhash":"UAPp-JsCNbr[UQagn*V^p-bYjIjtL?kSo]bG",
   "location":[
      24.933257,
      60.171263
   ],
   "name":"Charming Cherry House",
   "online": true,
   "launch_date":"2020-09-20",
   "popularity":0.665082352909038
}
```

### Fields:

- **blurhash**: image representation (type: string)
- **location**: Restaurant's location as latitude and longitude coordinates. First element in the list is the longitude (type: a list containing two decimal elements)
- **name**: The name of the restaurant (type: string)
- **launch_date**: the date when the restaurant was added to Wolt app (type: string, ISO 8601 date)
- **online**: if _true_, the restaurant is accepting orders. If _false_, the restaurant is closed (type: boolean)
- **popularity**: the higher the number, the more popular the restaurant is in Wolt app (type: a float between 0-1, where 1 is the - most popular restaurant)

## Backend assignment

_restaurants.json_ in the repository contains one hundred restaurants from the Helsinki area.

Your task is to create an **API endpoint** _/discovery_ that takes coordinates of the customer as an input and then **returns a page (JSON response)** containing _most popular, newest and nearby_ restaurants (based on given coordinates).

Location of a customer needs to be provided as **request parameters** _lat_ (latitude) and _lon_ (longitude), e.g. _/discovery?lat=60.1709&lon=24.941_. Both parameters accept float values.

An JSON object returned by the _/discovery_ -endpoint must have the following structure:

```
{
   "sections": [
      {
           "title": "Popular Restaurants",
           "restaurants": [.. add max 10 restaurant objects..]
      },
      {
           "title": "New Restaurants",
           "restaurants": [..add max 10 restaurant objects..]
      },
 	{
           "title": "Nearby Restaurants",
           "restaurants": [.. add max 10 restaurant objects..]
      }

   ]
}
```

For each _restaurants_-list you need to add **maximum 10** restaurant objects. A list can also contain fewer restaurants (or even be empty) if there are not enough objects matching given conditions. A section with an empty _restaurants_-list should be removed from the response.

**So how do you know which restaurants to add to each list?**

There are two main rules to follow:

- All restaurants returned by the endpoint must be **closer than 1.5 kilometers** from given coordinates, measured as a straight line between coordinates and the location of the restaurant.
- Open restaurants (_online=true_) are **more important** than closed ones. Every list must be first populated with open restaurants, and only adding closed ones if there is still capacity left.

In addition each list has a specific **sorting rule**:

- “Popular Restaurants”: highest _popularity_ value first (descending order)
- “New Restaurants”: Newest _launch_date_ first (descending). This list has also a special rule: _launch_date_ must be no older than 4 months.
- “Nearby Restaurants”: Closest to the given location first (ascending).

## General Instructions

- Write the assignment using either _TypeScript, ReasonML, Python, Scala, Kotlin_ or _Java_.
- The frontend version must use _React_ library
- Feel free to use any other 3rd party framework / library, however try to minimize external dependencies.
