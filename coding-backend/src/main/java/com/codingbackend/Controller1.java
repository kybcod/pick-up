package com.codingbackend;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class Controller1 {
    @GetMapping("/")
    @ResponseBody
    public String method1 (){
        return "Hello World";
    }
}
