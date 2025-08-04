

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>

#include "crow.h"

#include <chrono>



long long GetTimeAsMS() {
    return std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now().time_since_epoch()).count();
}

std::string ReadFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file) return "File not found!";
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

bool SaveFile(const std::string& filename, const std::string& content) {
    std::ofstream file(filename);
    if (!file) return false;
    file << content;
    return true;
}

int APIPort = 18080;

int main(){

    crow::SimpleApp app;

    std::string HTMLCode="";
    std::string JavaScriptCode="";
    std::string CssCode="";

    HTMLCode = ReadFile("ToDoList.html");
    JavaScriptCode = ReadFile("base.js");
    CssCode = ReadFile("main.css");

    std::string BlogHtml = ReadFile("Blog.html");
    std::string BlogJavaScript = ReadFile("blog.js");


    CROW_ROUTE(app, "/refresh")([HTMLCode]() {
        crow::response res;
        res.code = 200;
        res.set_header("Content-Type", "text/html");
        res.body = HTMLCode;
        return res;
    });

    CROW_ROUTE(app, "/")([HTMLCode]() {
        crow::response res;
        res.code = 200;
        res.set_header("Content-Type", "text/html");
        res.body = HTMLCode;
        return res;
    });

    CROW_ROUTE(app, "/base.js")([JavaScriptCode]() {
        crow::response res;
        res.code = 200;
        res.set_header("Content-Type", "application/javascript");
        res.body = JavaScriptCode;
        return res;
    });

    CROW_ROUTE(app, "/main.css")([CssCode]() {
        crow::response res;
        res.code = 200;
        res.set_header("Content-Type", "text/css");
        res.body = CssCode;
        return res;
    });

    CROW_ROUTE(app, "/blog")([BlogHtml]() {
        crow::response res;
        res.code = 200;
        res.set_header("Content-Type", "text/html");
        res.body = BlogHtml;
        return res;
    });

    CROW_ROUTE(app, "/blog.js")([BlogJavaScript]() {
        crow::response res;
        res.code = 200;
        res.set_header("Content-Type", "application/javascript");
        res.body = BlogJavaScript;
        return res;
    });
    

    app.port(APIPort).multithreaded().run();

    return 0;
}
