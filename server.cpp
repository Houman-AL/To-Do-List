

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

    HTMLCode = ReadFile("ToDoList.html");
    JavaScriptCode = ReadFile("base.js");


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

    app.port(APIPort).multithreaded().run();

    return 0;
}
