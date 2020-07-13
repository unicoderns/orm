# Contribute to Unicoderns ORM

Do you want to contribute to the ORM?

Please check this document in order to know how you can contribute and make the process easier for everyone involved.

## Issue tracker

If you want to report an issue or request a feature, please first check if the issue or feature is already reported, solved or requested in our issue tracker [here](https://github.com/unicoderns/orm/issues).

The issue tracker will be the main way to report bugs or request features, but please follow the instuctions below in order to keep the order.

- Please do not use the issue tracker for personal support requests.
- Keep the discussion on topic and respect the opinion of other people.

## Issues and labels

`confirmed` Issues that have been confirmed
`help wanted` Issues we need or would love help from the community to resolve

## Contribute

If you want to contributte please follow the instructions below:

1. Fork and clone the project in your computer.
   `git clone https://github.com/<your_username>/orm.git`

2. Go to the cloned directory.
   `cd orm`

3. Create a new branch, from the main branch (master), to contain your feature, change, or fix:

`git checkout -b <topic-branch-name>`

4. If you added something you think should be included in project´s documentation or in readme, please go and add it. This helps the team to keep the project updated.

5. Commit your changes. Please add a description for your commit (About 50 characters about what you did on your code). Use Git's [interactive rebase feature](https://help.github.com/en/github/using-git/about-git-rebase) to clean your commits before send a pull request.

6. Be sure that you add the corresponding unit tests and that everything passed by running `npm run test`. Remember that every code change you make should be covered by unit tests.

7. Locally merge or rebase your current changes into the development branch.
   `git pull [--rebase] upstream master`

8. Push your branch up to your fork:
   `git push origin <topic-branch-name>`

9. Open a Pull Request with a clear title and description against the master branch. Check [this link](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) to know more about pull requests.

**Note:** By submitting a patch, you agree to allow the project owners to license your work under the terms of the MIT License.

## Code Guidelines

### Typescript

- No semicolons
- 2 spaces (no tabs)
