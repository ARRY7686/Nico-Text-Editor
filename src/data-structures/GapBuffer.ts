class GapBuffer {
    buffer: string[] = Array(4).fill("");
    start = 0;
    end = 4;
    n = 4;

    Expand(): void {
        let new_buffer = Array(this.n * 2).fill("");
        for(let i=0; i<this.start; i++){ 
            new_buffer[i] = this.buffer[i];
        }
        for(let i=this.end; i<this.n; i++){
            new_buffer[this.n + i] = this.buffer[i];
        }
        this.end += this.n;
        this.n *= 2;
        this.buffer = new_buffer;
    }

    Insert(s:string) : void{
        if(this.start == this.end){
            this.Expand();
        }
        this.buffer[this.start++] = s;
    }

    Left(): void {
        if (this.start === 0) return;
        this.start--;
        this.end--;
        this.buffer[this.end] = this.buffer[this.start];
    }

    Right(): void{
        if(this.end == this.n) return;
        this.buffer[this.start] = this.buffer[this.end];
        this.start++; 
        this.end++; 
    }

    MoveCursor(pos: number): void {
        const contentLength = this.start + (this.n - this.end);
        pos = Math.max(0, Math.min(pos, contentLength));
        while (this.start > pos) this.Left();
        while (this.start < pos) this.Right();
    }

    Backspace() : void{
        if(this.start)  this.start--;
    }

    DeleteForward() : void{
        if(this.end < this.n) this.end++;
    }

    Get() : string{
        let text = "";
        for(let i = 0; i < this.start; i++){
            text += this.buffer[i];
        }
        for(let i = this.end; i < this.n; i++){
            text += this.buffer[i];
        }
        return text;
    }
}
