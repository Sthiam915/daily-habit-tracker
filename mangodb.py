import os
import json
import pickle
import random
class mangodb(object):

    def __init__(self, name:str):
        #initialize member variables
        self.home = os.getcwd()
        self.name = name
        self.sessions = set()

        #creates main database ID, and session directories
        if not os.path.isdir(name):
            os.mkdir(name)
        os.chdir(name)

        if not os.path.isdir('IDs'):
            os.mkdir('IDs')
        os.chdir(self.home)
        os.chdir(name)

        if not os.path.isdir('sessions'):
            os.mkdir('sessions')
        self.sessions.add("")
        
        os.chdir(self.home)
        
    #checks if the database contains an element(pretty self explanatory)
    def contains_element(self, id:str, section:str) -> bool:
        os.chdir(self.home)
        os.chdir(self.name)
        if section == "IDs":
            os.chdir('IDs')
            if not os.path.exists(id + '.pkl'):
                return False
            else:
                return True
        else:
            if not os.path.isdir(section):
                os.chdir(self.home)
                return False
            os.chdir(section)
            if not os.path.exists(id + ".json"):
                os.chdir(self.home)
                return False
            else:
                os.chdir(self.home)
                return True

    #checks if database contains a section(also pretty self explanatory)
    def contains_section(self, filename:str):
        os.chdir(self.home)
        os.chdir(self.name)
        if os.path.isdir(filename):
            os.chdir(self.home)
            return True
        else:
            os.chdir(self.home)
            return False
    
    #putting data into database
    def put(self, section:str, data, id:str) -> None:
        os.chdir(self.home)
        os.chdir(self.name)

        #creates a section directory if section does not exist yet
        if not os.path.isdir(section):
            os.mkdir(section)
            os.chdir('IDs')
            idfile = open(section + '.pkl','wb')
            tempset = set()
            pickle.dump(tempset,idfile)
            idfile.close()
            os.chdir(self.home)
            os.chdir(self.name)
        
        #opens json file with element name, inputs data
        os.chdir(section)
        temp = open(id + '.json', 'w')
        data = json.dumps(data)
        temp.write(data)
        temp.close()
        os.chdir(self.home)
        os.chdir(self.name)
        os.chdir('IDs')

        #puts element id into IDs folder
        if not os.path.isfile(section + 'pkl'):
            idfile = open(section + '.pkl','wb')
            tempset = set()
            pickle.dump(tempset,idfile)
            idfile.close()
        tempfile = open(section + '.pkl', 'rb')
        id_set = pickle.load(tempfile)
        tempfile.close()
        id_set.add(id)
        tempfile = open(section + '.pkl', 'wb')
        pickle.dump(id_set, tempfile)
        tempfile.close()
        os.chdir(self.home)

    #retrieves data from database
    def get(self, section:str, id:str):
        os.chdir(self.home)

        #inputs new id
        if section == "IDs":
            os.chdir(self.name)
            os.chdir('IDs')
            if not os.path.exists(id + '.pkl'):
                return None
            else:
                data = set()
                infile = open(id + '.pkl', 'rb')
                data = pickle.load(infile)
                infile.close()
                return data
        
        else:
            #makes sure database exists
            if not os.path.isdir(self.name):
                print("database does not exist")
                os.chdir(self.home)            
                return None
            os.chdir(self.name)
            #makes sure section exists
            if not os.path.isdir(section):
                print("section does not exist")
                os.chdir(self.home)
                return None
            os.chdir(section)
            #makes sure item exists in section
            if not os.path.exists(id + ".json"):
                print(id + ".json")
                os.chdir(self.home)
                return None
            
            #given all of the above pass, retrieves data
            data = dict()
            infile = open(id + ".json", "r")
            data = json.load(infile)
            infile.close()
            os.chdir(self.home)
            return data
        
    #session logic

    #create session id
    def makesessionid(self):
        
        chars = ['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g', \
                 'h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x', \
                 'y','z','Q','W','E','R','T','Y','U','O','P','A','S','D','F','G','H', \
                 'J','K','L','Z','X','C','V','B','N','M']
        sessid = ""

        #make sure that created session id is unique
        #!!! self.sessions may reload every time, might have to initialize self.sessions differently
        while sessid in self.sessions:
            for i in range(random.randint(20,30)):
                sessid += random.choice(chars)
        self.sessions.add(sessid)
        return sessid

    #creating session element for user inside database
    def makesession(self, username:str):
        
        os.chdir(self.home)
        os.chdir(self.name)
        os.chdir('sessions')
        sessid = self.makesessionid(username)
        sessionfile = open(sessid + '.json', 'w')
        sessionfile.write(json.dumps({'username':username}))
        sessionfile.close()
        os.chdir(self.home)
        return sessid

        
        

        
        


        

