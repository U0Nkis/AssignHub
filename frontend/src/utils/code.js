export const getLanguageName = (languageId) => {
  const languages = {
    50: 'C',
    54: 'C++',
    60: 'Go',
    62: 'Java',
    63: 'JavaScript',
    70: 'Python',
    71: 'Python',
    72: 'Ruby',
    73: 'Rust',
    74: 'TypeScript',
  };

  return languages[languageId] || 'Unknown';
};

export const getLanguageId = (languageName) => {
  const languages = {
    'c': 50,
    'cpp': 54,
    'go': 60,
    'java': 62,
    'javascript': 63,
    'python': 70,
    'python3': 71,
    'ruby': 72,
    'rust': 73,
    'typescript': 74,
  };

  return languages[languageName.toLowerCase()] || null;
};

export const getLanguageExtension = (languageId) => {
  const extensions = {
    50: '.c',
    54: '.cpp',
    60: '.go',
    62: '.java',
    63: '.js',
    70: '.py',
    71: '.py',
    72: '.rb',
    73: '.rs',
    74: '.ts',
  };

  return extensions[languageId] || '.txt';
};

export const getLanguageIcon = (languageId) => {
  const icons = {
    50: '⚡',
    54: '⚡',
    60: '🚀',
    62: '☕',
    63: '📜',
    70: '🐍',
    71: '🐍',
    72: '💎',
    73: '🦀',
    74: '📘',
  };

  return icons[languageId] || '📄';
};

export const getLanguageColor = (languageId) => {
  const colors = {
    50: '#555555',
    54: '#f34b7d',
    60: '#00ADD8',
    62: '#b07219',
    63: '#f7df1e',
    70: '#3572A5',
    71: '#3572A5',
    72: '#701516',
    73: '#dea584',
    74: '#2b7489',
  };

  return colors[languageId] || '#666666';
};

export const getLanguageTheme = (languageId) => {
  const themes = {
    50: 'monokai',
    54: 'monokai',
    60: 'monokai',
    62: 'monokai',
    63: 'monokai',
    70: 'monokai',
    71: 'monokai',
    72: 'monokai',
    73: 'monokai',
    74: 'monokai',
  };

  return themes[languageId] || 'monokai';
};

export const getLanguageMode = (languageId) => {
  const modes = {
    50: 'c_cpp',
    54: 'c_cpp',
    60: 'golang',
    62: 'java',
    63: 'javascript',
    70: 'python',
    71: 'python',
    72: 'ruby',
    73: 'rust',
    74: 'typescript',
  };

  return modes[languageId] || 'text';
};

export const getLanguageTemplate = (languageId) => {
  const templates = {
    50: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    54: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    60: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    62: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    63: `console.log("Hello, World!");`,
    70: `print("Hello, World!")`,
    71: `print("Hello, World!")`,
    72: `puts "Hello, World!"`,
    73: `fn main() {
    println!("Hello, World!");
}`,
    74: `console.log("Hello, World!");`,
  };

  return templates[languageId] || '';
}; 