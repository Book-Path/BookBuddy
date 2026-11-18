# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Deploy your project on Render
  - [x] In `readme.md`, add the link to your deployed project
- [x] Update the status of issues in your project board as you complete them
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title
  - [x] Under each feature you have completed, **include a GIF** showing feature functionality
- [x] In this document, complete the **Reflection** section below
- [x] 🚩🚩🚩**Complete the Final Project Feature Checklist section below**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned)
- [x] 🚩🚩🚩**Record a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist** below
  - [x] Include this GIF in the **Final Demo GIF** section below

## Final Project Feature Checklist

Complete the checklist below detailing each baseline, custom, and stretch feature you completed in your project. This checklist will help graders look for each feature in the GIF you submit.

### Baseline Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project includes an Express backend app and a React frontend app
- [x] The project includes these backend-specific features:
  - [x] At least one of each of the following database relationships in Postgres
    - [x] one-to-many
    - [x] many-to-many with a join table
  - [x] A well-designed RESTful API that:
    - [x] supports all four main request types for a single entity (ex. tasks in a to-do list app): GET, POST, PATCH, and DELETE
      - [x] the user can **view** items, such as tasks
      - [x] the user can **create** a new item, such as a task
      - [x] the user can **update** an existing item by changing some or all of its values, such as changing the title of task
      - [x] the user can **delete** an existing item, such as a task
    - [x] Routes follow proper naming conventions
  - [x] The web app includes the ability to reset the database to its default state
- [x] The project includes these frontend-specific features:
  - [x] At least one redirection, where users are able to navigate to a new page with a new URL within the app
  - [x] At least one interaction that the user can initiate and complete on the same page without navigating to a new page
  - [x] Dynamic frontend routes created with React Router
  - [x] Hierarchically designed React components
    - [x] Components broken down into categories, including Page and Component types
    - [x] Corresponding container components and presenter components as appropriate
- [x] The project includes dynamic routes for both frontend and backend apps
- [x] The project is deployed on Render with all pages and features that are visible to the user are working as intended

### Custom Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project gracefully handles errors
- [x] The project includes a one-to-one database relationship
- [ ] The project includes a slide-out pane or modal as appropriate for your use case that pops up and covers the page content without navigating away from the current page
- [x] The project includes a unique field within the join table
- [ ] The project includes a custom non-RESTful route with corresponding controller actions
- [ ] The user can filter or sort items based on particular criteria as appropriate for your use case
- [x] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account
- [ ] Data submitted via a POST or PATCH request is validated before the database is updated (e.g. validating that an event is in the future before allowing a new event to be created)
  - [ ] *To receive full credit, please be sure to demonstrate in your walkthrough that for certain inputs, the item will NOT be successfully created or updated.*

### Stretch Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] A subset of pages require the user to log in before accessing the content
  - [x] Users can log in and log out via GitHub OAuth with Passport.js
- [ ] Restrict available user options dynamically, such as restricting available purchases based on a user's currency
- [ ] Show a spinner while a page or page element is loading
- [ ] Disable buttons and inputs during the form submission process
- [ ] Disable buttons after they have been clicked
  - *At least 75% of buttons in your app must exhibit this behavior to receive full credit*
- [ ] Users can upload images to the app and have them be stored on a cloud service
  - *A user profile picture does **NOT** count for this rubric item **only if** the app also includes "Login via GitHub" functionality.*
  - *Adding a photo via a URL does **NOT** count for this rubric item (for example, if the user provides a URL with an image to attach it to the post).*
  - *Selecting a photo from a list of provided photos does **NOT** count for this rubric item.*
- [ ] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Final Demo GIF

🔗 [Here's a GIF walkthrough of the final project](https://www.loom.com/share/684e6c610e044559afcd8ba239de0d1c)
<div>
  <a href="https://www.loom.com/share/684e6c610e044559afcd8ba239de0d1c">
    <p>BookBuddy Demo - Watch Video</p>
  </a>
  <a href="https://www.loom.com/share/684e6c610e044559afcd8ba239de0d1c">
    <img width="300" src="https://www.loom.com/v1/videos/684e6c610e044559afcd8ba239de0d1c/thumbnail.gif">
  </a>
</div>

## Reflection

### 1. What went well during this unit?

What went well was splitting the work by our strengths, so Mihir was on backend logic, McKenna was on CSS
and I (David) was on the frontend pages and features. We were able to work in parallel without overwriting
each other's code.

### 2. What were some challenges your group faced in this unit?

We struggled a bit with deployment as although we had the new deployed domain, we had to adjust some of our
source code to no longer request from localhost. We also had to reset the database multiple times which makes
reseeding test data much more annoying since every one has to log back in.

### 3. What were some of the highlights or achievements that you are most proud of in this project?

Most proud of completing and shipping a full stack application using what we learned during the course.
Some highlights include creating the achievement system where the reading stats update inside a database
transaction, achievements unlock automatically, and the page shows locked vs unlocked ones. Also allowing
the user to login via Github OAuth.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

We have grown by now understanding much more advanced SQL instead of just CRUD operations. We have a better
understanding of debugging through the Network tab and console, and of the github workflow with clean commit messages
and PRs. We also learned and understand how the whole stack connects from a React form, through Express routes,
controllers, and services, to the Postgres database and back.

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?

Our goals related to web development would be to continue working on team projects and also to find a niche in
web development based on our respective strengths. We saw that we each fit well into a specific role and
took advantage of it which made working collaboratively much easier. In order to achieve these, we can continue
working on BookBuddy and continue developing features and fixing any bugs that arise as users start using our web app.
