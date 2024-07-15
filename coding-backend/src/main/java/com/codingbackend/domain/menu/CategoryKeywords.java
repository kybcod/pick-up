package com.codingbackend.domain.menu;

import java.util.HashMap;
import java.util.Map;

public class CategoryKeywords {
    private static final Map<String, String> categoryKeywords = new HashMap<>();

    static {
        categoryKeywords.put("한식", "김치|비빔밥|불고기");
        categoryKeywords.put("중식", "짜장면|짬뽕|탕수육");
        categoryKeywords.put("일식", "스시|라멘|우동|돈까스|돈가스|카츠|카레");
        categoryKeywords.put("분식", "떡볶이|김밥|오뎅");
        categoryKeywords.put("양식", "스테이크|파스타|리조또");
        categoryKeywords.put("치킨", "치킨");
        categoryKeywords.put("피자", "피자");
        categoryKeywords.put("족발 • 보쌈", "족발|보쌈");
        categoryKeywords.put("버거", "햄버거|버거");
        categoryKeywords.put("카페", "커피|케이크|빵|아메리카노");
    }

    public static Map<String, String> getCategoryKeywords() {
        return categoryKeywords;
    }
}
