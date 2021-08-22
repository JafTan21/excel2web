#include<bits/stdc++.h>
using namespace std;

    map<string, int> m;

vector<string> getSubStrings(string s)
{
    vector<string> v;
    int index;
    string temp;

    for(int i=0; i<s.length(); i++)
    {
        index=1;
        for(int j=i; j<s.length(); j++)
        {
            temp = s.substr(i, index);
            if(temp != s) {
                v.push_back(temp);
                m[temp]++;
            }
            index++;
        }
    }
    return v;
}

map<string, int> getRemakes(string s)
{
    map<string, map<int, int>> v;
    int index;
    char t;
    if(s.length() == 1){
        v[s].first++;
    }
    else{
        for(int i=0; i<s.length(); i++)
    {
        index = 0;
        for(int j=1; j<s.length(); j++)
        {
            t = s[index];
            s[index] = s[j];
            s[j]=t;

            v[s].first++;
            //cout << s << endl;
            index++;
        }
    }
    }
    return v;
}

int solution(string s)
{
    vector<string> subStrings = getSubStrings(s);
    int count = 0;

    for(auto sub = subStrings.begin(); sub!=subStrings.end(); sub++){
        for(auto r: getRemakes(*sub)){
            if(m[r.first]>0){
                count++;
                //subStrings.erase(sub);
                //subStrings.erase(m[r.first].first);
            }
        }
    }

    //cout << endl << endl;
    //getRemakes(s);
//cout << "count "<< count;
    return count;
}

int main()
{
    string s = "kkkk";

    cout << solution(s);

    return 0;
}

/*
if(*sub != ""){
                    cout << *sub << " == ";
                    map<string, int> remakes = getRemakes(*sub);
                    for(auto r: remakes){
                        if(*sub == r.first && m[r.first] != 1){
                            cout << r.first << "(1) ";
                            count++;
                            subStrings.erase(sub);
                            break;
                        }
                        else if(m[r.first] > 0 && *sub != r.first){
                            cout << r.first << "(2) ";
                            count++;
                            subStrings.erase(sub);
                            break;
                        }
                    }
                    cout << endl;
            }
        //cout << sub.first << "-> " << sub.second << endl;
*/














