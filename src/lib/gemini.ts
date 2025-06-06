import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

export const getAiSummarisedCommit = async (diff: string) => {
    const response = await model.generateContent([
        `
        You are an expert programmer, and you are trying to summarize a git diff.
        Reminders about the git diff format:
        For every file, there are a few metadata lines, like (for example):
        \`\`\`
        diff --git a/lib/index.js b/lib/index.js
        index aadf691..bfef603 100644
        --- a/lib/index.js
        +++ b/lib/index.js
        \`\`\`
        This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
        Then there is a specifier of the lines that were modified.
        A line starting with \`+\` means it was added.
        A line that starting with \`-\` means it was deleted.
        A line that starts with neither \`+\` nor \`-\` is code give for context and better understanding.
        It is not part of the diff.
        [...]
        EXAMPLE SUMMARY COMMENTS: 
        \`\`\`
        * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/contants.ts]
        * Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
        * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
        * Added an OpenAI API for completions [packages/utils/openai.ts]
        * Lowered numeric tolerance for test files
        \`\`\`
        Most commits will have less comments than this example list.
        The last comment does not include the file names, because there were more than two relevant files in the hypothetical commit.
        Do not include parts of the example in your summary.
        It is given only as an example of appropriate comments.
        `,
        `Please summarise the following diff file: \n\n${diff}`,
    ]);

    return response.response.text();
}

console.log(await getAiSummarisedCommit(`
    diff --git a/README.md b/README.md
index 20ab74f..81bdc04 100644
--- a/README.md
+++ b/README.md
@@ -6,7 +6,7 @@ IncogniNote is an innovative anonymous feedback messaging application designed t
 
 1. **Anonymous Messaging**: Users can send messages anonymously without revealing their identity, fostering candid conversations.
 
-2. **User Authentication**: Secure user authentication is implemented using Auth0, ensuring that only authenticated users can access the platform.
+2. **User Authentication**: Secure user authentication is implemented using Oauth, ensuring that only authenticated users can access the platform.
 
 3. **Form Handling**: React Hook Forms are utilized for efficient form handling, providing a smooth user interface for message submission.
 
@@ -37,7 +37,7 @@ IncogniNote is an innovative anonymous feedback messaging application designed t
 
 - **Authentication**:
 
-  - Auth0
+  - Oauth
 
 - **Validation**:
   - Zod
@@ -60,7 +60,7 @@ IncogniNote is an innovative anonymous feedback messaging application designed t
    npm install
 
-3. Set up environment variables for Auth0, MongoDB Atlas, and any other necessary configurations.
+3. Set up environment variables for Oauth, MongoDB Atlas, and any other necessary configurations.
 
 4. Start the development server:
 
@@ -70,7 +70,7 @@ IncogniNote is an innovative anonymous feedback messaging application designed t
 
 # Usage:
 
-1. Sign in using your Auth0 credentials or create a new account if you're a new user.
+1. Sign in using your Oauth credentials or create a new account if you're a new user.
 2. Explore the user-friendly interface to send anonymous messages or view received feedback.
 3. Enjoy open and honest communication while maintaining anonymity.
 
diff --git a/package-lock.json b/package-lock.json
index c90633d..9f03f0d 100644
--- a/package-lock.json
+++ b/package-lock.json
@@ -1,11 +1,11 @@
 {
-  "name": "mstrymessage",
+  "name": "incogninote",
   "version": "0.1.0",
   "lockfileVersion": 3,
   "requires": true,
   "packages": {
     "": {
-      "name": "mstrymessage",
+      "name": "incogninote",
       "version": "0.1.0",
       "dependencies": {
         "@hookform/resolvers": "^3.3.4",
diff --git a/tempCodeRunnerFile.ts b/tempCodeRunnerFile.ts
deleted file mode 100644
index 2d393f8..0000000
--- a/tempCodeRunnerFile.ts
+++ /dev/null
@@ -1,8 +0,0 @@
-var x = 20
-
-function foo(){
-    console.log(x);
-    var x = 10;
-}
-
-foo();
\ No newline at end of file
`))