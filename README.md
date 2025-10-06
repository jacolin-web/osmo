# Fragrance Data Table

- I created an expandable Table component that would allow the user to view data,
  headers are clickable is built in with sorting. I think in the next iteration I would make Table component
  even more generic by maybe passing a prop to indicate that this is an expandable table and aggregate based on that.

- Search component was built to be completely reusable, returns the searchQuery, and the App filters the
  data based on that.

- The Filter component returns the list of categories and allows the user to click as many categories.
  Due to time constraints this is not as generic and more specific to the needs of this assesment.

- I also ran aXe metrics to ensure that this page passes WCAG AA standards.

- As for styling, I relied heavily on Tailwind and used those color variables, in the future I would
  utilize color tokens to easily change color themes across the application.

- If I had more time, I would also have better handling on empty states.

- Lastly, I omitted testing for this assessment but I normally I would have unit tests for the core components
  such as the Filter, Search and Table functions.
